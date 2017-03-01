export interface IStorage {
  set(key: string, value: Object): void;
  get(key: string): Object;
  remove(key: string): void;
}
