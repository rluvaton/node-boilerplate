import { AsyncLocalStorage } from 'node:async_hooks'

const storage = new AsyncLocalStorage<any>()

export function get<Key, Value>(key: Key): Value | undefined {
  return storage.getStore()?.[key]
}

export function getAll<T>(): T | undefined {
  return storage.getStore()
}

export function set<Key, Value>(key: Key, value: Value) {
  const store = storage.getStore()

  store && (store[key] = value)
}

export function setMulti<T>(object: Partial<T>) {
  const store = storage.getStore()

  Object.assign(store, object)
}

export function run<StoreValue, FnReturnType>(
  fn: (...args: any[]) => FnReturnType,
  initialValue: StoreValue = {} as StoreValue,
): FnReturnType {
  return storage.run(initialValue, () => fn())
}

export default {
  get,
  getAll,
  set,
  setMulti,
  run,
}
