import { IItem } from '../../sdk';

export function isIssue(item: IItem) {
  return !!(item && item.kind === 'issue');
}
