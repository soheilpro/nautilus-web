import { IStorage } from './istorage';

export class SessionStorage implements IStorage {
  set(key: string, value: Object) {
    return Promise.resolve(window.sessionStorage.setItem(key, JSON.stringify(value)));
  }

  get(key: string) {
    const data = window.sessionStorage.getItem(key);

    if (!data)
      return Promise.resolve(undefined);

    return Promise.resolve(JSON.parse(data));
  }

  remove(key: string) {
    return Promise.resolve(window.sessionStorage.removeItem(key));
  }
}
