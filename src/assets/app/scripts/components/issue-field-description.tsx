import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class DescriptionIssueField extends IssueField {
  isMultiline() {
    return true;
  }

  getPlaceholder(): string {
    return "Enter description";
  }

  getValue(): string {
    return this.props.issue.getDescription();
  }

  setValue(value: string): void {
    Nautilus.Instance.updateIssue(this.props.issue, { description: value });
  }
};
