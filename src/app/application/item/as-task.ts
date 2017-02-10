import { IItem } from '../../sdk';

export function asTask(item: IItem) {
  return item && item.kind === 'task' ? item : null;
}
