import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class AssignedUserIssueField extends IssueField {
  getItem() {
    return this.props.issue.getAssignedUser();
  }

  getItems() {
    return Nautilus.Instance.getUsers();
  }

  itemToString(item) {
    return item ? item.name : '';
  }

  itemFromString(value, items) {
    return _.find(items, (item : any) => item.name.toLowerCase() === value.toLowerCase());
  }

  itemComparer(item1, item2) {
    return item1 && item2 && item1.id === item2.id;
  }

  onChanged(value) {
    Nautilus.Instance.updateIssue(this.props.issue, { assignedUser: value || null });
  }
};
