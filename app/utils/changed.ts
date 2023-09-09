// @ts-ignore
import shallowCompare from 'react-addons-shallow-compare';
import {isClientDevMode} from "./env";

const cache: Record<string, any> = {}
const timeoutId: Record<string, any> = {}

/**
 * Check sth hasChanged in "duration" ms timed window
 *
 * @param key unique identifier of the array, for checking with old state
 * @param a
 * @param duration default 1000ms, check has change in this time window
 * @return true if any array el has changed, or true for the first time
 */
export function hasChanged(key: string, a: any[], duration = 500): boolean {
  // console.log('{hasChanged} key, a, cache[key]: ', key, a, cache[key]);
  if (!(key in cache)) {
    cache[key] = a
    return true
  }

  let diff = false;
  const old_a = cache[key];
  for (let i = 0, c = a.length; i < c; i++) {
    const item = a[i];
    const old_item = old_a[i]
    if (shallowCompare({props: old_item, state: null}, item, null)) {
      diff = true
      break
    }
  }
  cache[key] = a

  // release memory
  clearTimeout(timeoutId[key])
  timeoutId[key] = setTimeout(() => {
    delete cache[key]
  }, duration)

  return diff
}

if (isClientDevMode) {
  //@ts-ignore
  window.tmp__shallowCompare = shallowCompare
  //@ts-ignore
  window.tmp__hasChanged = hasChanged
}
