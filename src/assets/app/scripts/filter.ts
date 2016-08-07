import { IEntity } from './sdk/nautilus';

export interface IComparer {
  (item1: any, item2: any): boolean;
}

export class FilterSet {
  private items: string[];
  [key: string]: any; // Should be DualSet[]

  constructor(items: string[], comparer: IComparer) {
    this.items = items;

    items.forEach((item) => {
      (this as any)[item] = new DualSet(comparer);
    });
  }

  clear() {
    this.items.forEach((item) => {
      (this as any)[item].clear();
    });
  };
}

export class DualSet {
  include: Set;
  exclude: Set;

  constructor(comparer: IComparer) {
    this.include = new Set(comparer);
    this.exclude = new Set(comparer);

    this.include.add = (item) => {
      Set.prototype.add.call(this.include, item);
      this.exclude.remove(item);
    }

    this.exclude.add = (item) => {
      Set.prototype.add.call(this.exclude, item);
      this.include.remove(item);
    }
  }

  clear() {
    this.include.clear();
    this.exclude.clear();
  };
}

export class Set {
  items: any[];
  comparer: IComparer;

  constructor(comparer: IComparer) {
    this.items = [];
    this.comparer = comparer;
  }

  clear() {
    this.items = [];
  };

  set(item: any) {
    this.items = [item];
  };

  setAll(items: any[]) {
    this.items = items;
  };

  add(item: any) {
    if (!this.has(item))
      this.items.push(item);
  };

  remove(item: any) {
    this.items = _.reject(this.items, (_item) => {
      return this.comparer(_item, item);
    });
  };

  toggle(item: any, state: boolean) {
    if (state)
      this.add(item);
    else
      this.remove(item);
  };

  has(item: any) {
    return _.some(this.items, (_item) => {
      return this.comparer(_item, item);
    });
  };
}
