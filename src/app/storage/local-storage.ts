import { IStorage } from './istorage';

export class LocalStorage implements IStorage {
  set(key: string, value: Object) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    let data = window.localStorage.getItem(key);

    if (!data)
      return undefined;

    return JSON.parse(data);
  }

  remove(key: string) {
    window.localStorage.removeItem(key);
  }
}
