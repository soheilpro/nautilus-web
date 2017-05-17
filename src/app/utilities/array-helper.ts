import * as _ from 'underscore';

export default class ArrayHelper {
  static replaceElement<T>(array: T[], oldItem: T, newItem: T, comparer: (item1: T, item2: T) => boolean) {
    array = [...array];
    array.splice(_.findIndex(array, _.partial(comparer, oldItem)), 1, newItem);

    return array;
  };

  static removeElement<T>(array: T[], item: T, comparer: (item1: T, item2: T) => boolean) {
    array = [...array];
    array.splice(_.findIndex(array, _.partial(comparer, item)), 1);

    return array;
  };
}
