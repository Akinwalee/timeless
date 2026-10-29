type StorageName = "localStorage" | "sessionStorage";

export function readStorage(name: StorageName, key: string) {
  try {
    return { value: window[name].getItem(key), available: true };
  } catch {
    return { value: null, available: false };
  }
}

export function writeStorage(name: StorageName, key: string, value: string) {
  try {
    window[name].setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
