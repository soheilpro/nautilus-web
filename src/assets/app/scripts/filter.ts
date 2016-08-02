export class FilterSet {
  items;

  constructor(items) {
    this.items = items;

    var idComparer = (item1, item2) => {
      return item1.id === item2.id;
    };

    items.forEach((item) => {
      this[item] = new DualSet(idComparer);
    });
  }

  clear() {
    this.items.forEach((item) => {
      this[item].clear();
    });
  };
}

class DualSet {
  include;
  exclude;

  constructor(comparer) {
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

class Set {
  items;
  comparer;

  constructor(comparer) {
    this.items = [];
    this.comparer = comparer;
  }

  clear() {
    this.items = [];
  };

  set(item) {
    this.items = [item];
  };

  setAll(items) {
    this.items = items;
  };

  add(item) {
    if (!this.has(item))
      this.items.push(item);
  };

  remove(item) {
    this.items = _.reject(this.items, (_item) => {
      return this.comparer(_item, item);
    });
  };

  toggle(item, state) {
    if (state)
      this.add(item);
    else
      this.remove(item);
  };

  has(item) {
    return _.some(this.items, (_item) => {
      return this.comparer(_item, item);
    });
  };
}
