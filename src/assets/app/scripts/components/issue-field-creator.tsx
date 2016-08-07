import * as React from 'react';
import { Nautilus, IUser } from '../nautilus';
import { IssueField } from './issue-field';

export class CreatorIssueField extends IssueField {
  getValue(): IUser {
    return this.props.issue.getCreator();
  }

  valueToString(value: IUser) {
    return value ? value.name : '';
  }

  isEditable(): boolean {
    return false;
  }
};
