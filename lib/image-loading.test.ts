import { describe, expect, it, vi } from "vitest";
import { allowImageWarming, createImagePreparer, createLatestImageSelection } from "./image-loading";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

describe("selective preparation", () => {
  it("respects connection restrictions", () => {
    expect(allowImageWarming()).toBe(true);
    expect(allowImageWarming({ effectiveType: "4g", downlink: 10 })).toBe(true);
    for (const connection of [{ saveData: true }, { effectiveType: "2g" }, { effectiveType: "slow-2g" }, { downlink: .5 }]) expect(allowImageWarming(connection)).toBe(false);
  });

  it("deduplicates exact responsive requests with at most two concurrent loads", async () => {
    const requests = [deferred<boolean>(), deferred<boolean>(), deferred<boolean>()];
    let cursor = 0;
    const load = vi.fn(() => requests[cursor++].promise);
    const prepare = createImagePreparer(load);
    const a = prepare({ src: "a", srcSet: "a 640w", sizes: "350px" });
    expect(prepare({ src: "a", srcSet: "a 640w", sizes: "350px" })).toBe(a);
    const b = prepare({ src: "b" });
    const c = prepare({ src: "c" });
    expect(load).toHaveBeenCalledTimes(2);
    requests[0].resolve(true);
    await a;
    await new Promise((done) => setTimeout(done, 0));
    expect(load).toHaveBeenCalledTimes(3);
    requests[1].resolve(true); requests[2].resolve(true);
    await Promise.all([b, c]);
    expect(prepare({ src: "a", srcSet: "a 640w", sizes: "350px" })).toBe(a);
  });

  it("bounds speculative queue length and permits failed requests to retry", async () => {
    const pending = deferred<boolean>();
    const prepare = createImagePreparer(() => pending.promise);
    const work = Array.from({ length: 10 }, (_, i) => prepare({ src: String(i) }));
    expect(await prepare({ src: "overflow" })).toBe(false);
    pending.resolve(true);
    await Promise.all(work);
    const load = vi.fn().mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    const retry = createImagePreparer(load);
    expect(await retry({ src: "failed" })).toBe(false);
    expect(await retry({ src: "failed" })).toBe(true);
  });
});

describe("replacement readiness", () => {
  it("commits only the latest selected variant even when older requests finish later", async () => {
    const commit = vi.fn(); const failed = vi.fn();
    const selection = createLatestImageSelection(commit, failed);
    const old = deferred<boolean>(); const latest = deferred<boolean>();
    selection.select("White", old.promise); selection.select("Cream", latest.promise);
    latest.resolve(true); await latest.promise;
    old.resolve(true); await old.promise;
    expect(commit).toHaveBeenCalledExactlyOnceWith("Cream");
    expect(failed).not.toHaveBeenCalled();
  });

  it("retains the previous image on failure and cancels obsolete selections", async () => {
    const commit = vi.fn(); const failed = vi.fn();
    const selection = createLatestImageSelection(commit, failed);
    selection.select("White", Promise.resolve(false));
    await new Promise((done) => setTimeout(done, 0));
    expect(failed).toHaveBeenCalledExactlyOnceWith("White");
    expect(commit).not.toHaveBeenCalled();
    const pending = deferred<boolean>();
    selection.select("Cream", pending.promise); selection.cancel(); pending.resolve(true);
    await pending.promise;
    expect(commit).not.toHaveBeenCalled();
  });
});
