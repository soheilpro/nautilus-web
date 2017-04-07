import { IItem } from '../../sdk';

export function isMilestone(item: IItem) {
  return !!(item && item.kind === 'milestone');
}
