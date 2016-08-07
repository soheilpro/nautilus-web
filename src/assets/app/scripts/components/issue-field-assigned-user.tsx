import * as React from 'react';
import { Nautilus, IUser } from '../nautilus';
import { IssueField } from './issue-field';

export class AssignedUserIssueField extends IssueField {
  getValue(): IUser {
    return this.props.issue.getAssignedUser();
  }

  getValues(): IUser[] {
    return Nautilus.Instance.getUsers();
  }

  valueToString(value: IUser) {
    return value ? value.name : '';
  }

  valueFromString(value: string, values: IUser[]): IUser {
    return _.find(values, (x: any) => x.name.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IUser, value2: IUser): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IUser): void {
    Nautilus.Instance.updateIssue(this.props.issue, { assignedUsers: [value] || null });
  }
};
