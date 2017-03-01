import { IStorage } from './istorage';

export class SessionStorage implements IStorage {
  set(key: string, value: Object) {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    let data = window.sessionStorage.getItem(key);

    if (!data)
      return undefined;

    return JSON.parse(data);
  }

  remove(key: string) {
    window.sessionStorage.removeItem(key);
  }
}
