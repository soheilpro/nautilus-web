import * as React from 'react';
import { Nautilus, IUser } from '../nautilus';
import { IssueField } from './issue-field';

export class CreatedByIssueField extends IssueField {
  getValue(): IUser {
    return this.props.issue.getCreatedBy();
  }

  valueToString(value: IUser) {
    return value ? value.name : '';
  }

  isEditable(): boolean {
    return false;
  }
};
