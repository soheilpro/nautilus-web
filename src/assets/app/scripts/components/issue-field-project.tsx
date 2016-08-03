import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class ProjectIssueField extends IssueField {
  getValue() {
    return this.props.issue.getProject();
  }

  getValues() {
    return Nautilus.Instance.getProjects();
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
    Nautilus.Instance.updateIssue(this.props.issue, { project: value || null });
  }
};
