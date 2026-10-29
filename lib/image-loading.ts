export type ImageRequest = { src: string; srcSet?: string; sizes?: string };
export type ConnectionInfo = { saveData?: boolean; effectiveType?: string; downlink?: number };

export function allowImageWarming(connection?: ConnectionInfo) {
  return !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType || "") &&
    !(typeof connection?.downlink === "number" && connection.downlink < 1);
}

export function imageRequestKey(request: ImageRequest) {
  return `${request.src}|${request.srcSet || ""}|${request.sizes || ""}`;
}

// A small request ledger, not an image-object cache. It deduplicates identical
// responsive requests and releases decoded image objects after preparation.
export function createImagePreparer(load: (request: ImageRequest) => Promise<boolean>) {
  const ledger = new Map<string, Promise<boolean>>();
  const queue: Array<{ request: ImageRequest; key: string; resolve: (ready: boolean) => void }> = [];
  let running = 0;
  function drain() {
    while (running < 2 && queue.length) {
      const task = queue.shift()!;
      running++;
      load(task.request).catch(() => false).then((ready) => {
        if (!ready) ledger.delete(task.key);
        task.resolve(ready);
      }).finally(() => { running--; drain(); });
    }
  }
  return function prepare(request: ImageRequest, intent = false) {
    const key = imageRequestKey(request);
    const existing = ledger.get(key);
    if (existing) return existing;
    if (queue.length >= 8) {
      if (!intent) return Promise.resolve(false);
      const dropped = queue.pop()!;
      ledger.delete(dropped.key);
      dropped.resolve(false);
    }
    const promise = new Promise<boolean>((resolve) => {
      const task = { request, key, resolve };
      if (intent) queue.unshift(task); else queue.push(task);
    });
    ledger.set(key, promise);
    if (ledger.size > 64) ledger.delete(ledger.keys().next().value!);
    drain();
    return promise;
  };
}

const prepare = createImagePreparer((request) => new Promise<boolean>((resolve) => {
  const image = new Image();
  const timeout = setTimeout(() => finish(false), 15000);
  function finish(ready: boolean) {
    clearTimeout(timeout);
    image.onload = null;
    image.onerror = null;
    resolve(ready);
  }
  image.onload = () => image.decode().then(() => finish(true)).catch(() => finish(image.complete && image.naturalWidth > 0));
  image.onerror = () => finish(false);
  image.decoding = "async";
  image.sizes = request.sizes || "100vw";
  image.srcset = request.srcSet || "";
  image.src = request.src;
}));

export function prepareImage(request: ImageRequest, intent = false) {
  return prepare(request, intent);
}

export function createLatestImageSelection<T>(commit: (value: T) => void, failed: (value: T) => void) {
  let revision = 0;
  return {
    select(value: T, ready: Promise<boolean>) {
      const current = ++revision;
      void ready.catch(() => false).then((loaded) => {
        if (current !== revision) return;
        if (loaded) commit(value); else failed(value);
      });
    },
    cancel() { revision++; },
  };
}
