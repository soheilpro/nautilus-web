import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class StateIssueField extends IssueField {
  getValue() {
    return this.props.issue.getState();
  }

  getValues() {
    return Nautilus.Instance.getStates();
  }

  valueToString(value) {
    return value ? value.title : '';
  }

  valueFromString(value, values) {
    return _.find(values, (x : any) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1, value2) {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value) {
    Nautilus.Instance.updateIssue(this.props.issue, { state: value || null });
  }
};
