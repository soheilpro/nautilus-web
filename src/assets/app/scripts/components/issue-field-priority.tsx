import * as React from 'react';
import { Nautilus, IItemPriority } from '../nautilus';
import { IssueField } from './issue-field';

export class PriorityIssueField extends IssueField {
  getPlaceholder(): string {
    return "Select priority";
  }

  getValue(): IItemPriority {
    return this.props.issue.getPriority();
  }

  getValues(): IItemPriority[] {
    return Nautilus.Instance.getItemPriorities();
  }

  valueToString(value: IItemPriority): string {
    return value ? value.title : '';
  }

  valueFromString(value: string, values: IItemPriority[]): IItemPriority {
    return _.find(values, (x: IItemPriority) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IItemPriority, value2: IItemPriority): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IItemPriority): void {
    Nautilus.Instance.updateIssue(this.props.issue, { priority: value || null });
  }
};
