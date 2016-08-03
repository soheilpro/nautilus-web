import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class MilestoneIssueField extends IssueField {
  getValue() {
    return this.props.issue.getMilestone();
  }

  getValues() {
    return Nautilus.Instance.getMilestones();
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
    Nautilus.Instance.updateIssueMilestone(this.props.issue, value || null);
  }
};
