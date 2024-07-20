import lodash from "lodash";
import { writable, type Unsubscriber, type Writable } from "svelte/store";

export function getCourseIdFromURL(url: string = window.location.pathname) {
  const paths = url.split("/");
  const courseId = paths.findIndex((v) => v === "courses") + 1;
  return paths?.[courseId];
}

/** Returns whether an object is isEmpty
  */
export function isNotEmpty<T>(obj: {} | T): obj is T {
  return !lodash.isEmpty(obj);
}
type NullToUndefined<T> = {
    [P in keyof T]: Exclude<T[P], null> | undefined;
};
export function nullablePropertiesToOptional<T extends { [key: string]: any }>(obj: T): NullToUndefined<T> {
    const result = {} as NullToUndefined<T>;
    for (const key in obj) {
        if (obj[key] === null) {
            result[key] = undefined;
        } else {
            result[key] = obj[key] as any;
        }
    }
    return result;
}

interface CachedWritable<T> {
  cachedWritable: Writable<T|null>;
  cacheUpdateUnsubscriber: Unsubscriber
}

/** Create a writable and sync it with the browser localStorage
 * with the provided key
 */
export function createCachedWritable<T>(store_key: string): CachedWritable<T> {
  const cachedValue = localStorage.getItem(store_key);
  const w = writable<T|null>(cachedValue ? JSON.parse(cachedValue) : null);
  const unsubscriber = w.subscribe((v) => {
    if (v === null) localStorage.removeItem(store_key);
    else localStorage.setItem(store_key, JSON.stringify(v));
  });
  return {
    cachedWritable: w,
    cacheUpdateUnsubscriber: unsubscriber
  };
}
