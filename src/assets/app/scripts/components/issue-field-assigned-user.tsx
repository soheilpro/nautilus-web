import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class AssignedUserIssueField extends IssueField {
  getValue() {
    return this.props.issue.getAssignedUser();
  }

  getValues() {
    return Nautilus.Instance.getUsers();
  }

  valueToString(value) {
    return value ? value.name : '';
  }

  valueFromString(value, values) {
    return _.find(values, (x : any) => x.name.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1, value2) {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value) {
    Nautilus.Instance.updateIssue(this.props.issue, { assignedUser: value || null });
  }
};
