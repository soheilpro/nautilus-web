import { IItem } from '../../sdk';

export function asIssue(item: IItem) {
  return item && item.kind === 'issue' ? item : null;
}
