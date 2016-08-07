import * as React from 'react';
import { Nautilus, IItemType } from '../nautilus';
import { IssueField } from './issue-field';

export class TypeIssueField extends IssueField {
  getValue(): IItemType {
    return this.props.issue.getType();
  }

  getValues(): IItemType[] {
    return Nautilus.Instance.getIssueTypes();
  }

  valueToString(value: IItemType): string {
    return value ? value.title : '';
  }

  valueFromString(value: string, values: IItemType[]): IItemType {
    return _.find(values, (x: IItemType) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IItemType, value2: IItemType): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IItemType): void {
    Nautilus.Instance.updateIssue(this.props.issue, { type: value || null });
  }
};
