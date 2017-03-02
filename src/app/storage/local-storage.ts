import { IStorage } from './istorage';

export class LocalStorage implements IStorage {
  set(key: string, value: Object) {
    return Promise.resolve(window.localStorage.setItem(key, JSON.stringify(value)));
  }

  get(key: string) {
    const data = window.localStorage.getItem(key);

    if (!data)
      return Promise.resolve(undefined);

    return Promise.resolve(JSON.parse(data));
  }

  remove(key: string) {
    return Promise.resolve(window.localStorage.removeItem(key));
  }
}
