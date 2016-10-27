import * as React from 'react';
import { Nautilus, IItemState } from '../nautilus';
import { IssueField } from './issue-field';

export class StateIssueField extends IssueField {
  getPlaceholder(): string {
    return "State";
  }

  getValue(): IItemState {
    return this.props.issue.getState();
  }

  getValues(): IItemState[] {
    return Nautilus.Instance.getIssueStates();
  }

  valueToString(value: IItemState): string {
    return value ? value.title : '';
  }

  valueFromString(value: string, values: IItemState[]): IItemState {
    return _.find(values, (x: IItemState) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IItemState, value2: IItemState): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IItemState): void {
    Nautilus.Instance.updateIssue(this.props.issue, { state: value || null });
  }
};
