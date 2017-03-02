export interface IStorage {
  set(key: string, value: Object): Promise<void>;
  get(key: string): Promise<Object>;
  remove(key: string): Promise<void>;
}
