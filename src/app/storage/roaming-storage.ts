import { LocalStorage } from './local-storage';
import { IAsyncStorage } from '../storage';

export class RoamingStorage implements IAsyncStorage {
  private localStorage = new LocalStorage();

  set(key: string, value: Object) {
    return Promise.resolve(this.localStorage.set(key, value));
  }

  get(key: string) {
    return Promise.resolve(this.localStorage.get(key));
  }

  remove(key: string) {
    return Promise.resolve(this.localStorage.remove(key));
  }
}
