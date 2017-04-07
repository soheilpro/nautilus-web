import { IItem } from '../../sdk';

export function asMilestone(item: IItem) {
  return item && item.kind === 'milestone' ? item : null;
}
