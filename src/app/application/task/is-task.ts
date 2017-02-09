import { IItem } from '../../sdk';

export function isTask(item: IItem) {
  return !!(item && item.kind === 'task');
}
