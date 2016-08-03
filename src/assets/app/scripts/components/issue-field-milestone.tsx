import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class MilestoneIssueField extends IssueField {
  getItem() {
    return this.props.issue.getMilestone();
  }

  getItems() {
    return Nautilus.Instance.getMilestones();
  }

  itemToString(item) {
    return item ? item.title : '';
  }

  itemFromString(item, items) {
    return _.find(items, (item : any) => item.title.toLowerCase() === item.toLowerCase());
  }

  itemComparer(item1, item2) {
    return item1 && item2 && item1.id === item2.id;
  }

  setItem(item) {
    Nautilus.Instance.updateIssueMilestone(this.props.issue, item || null);
  }
};
