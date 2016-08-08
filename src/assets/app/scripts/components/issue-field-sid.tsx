import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class SidIssueField extends IssueField {
  getValue(): string {
    return this.props.issue.sid;
  }

  isEditable(): boolean {
    return false;
  }
};
