import * as React from 'react';
import { Nautilus, IState } from '../nautilus';
import { IssueField } from './issue-field';

export class StateIssueField extends IssueField {
  getValue(): IState {
    return this.props.issue.getState();
  }

  getValues(): IState[] {
    return Nautilus.Instance.getStates();
  }

  valueToString(value: IState): string {
    return value ? value.title : '';
  }

  valueFromString(value: string, values: IState[]): IState {
    return _.find(values, (x: IState) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IState, value2: IState): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IState): void {
    Nautilus.Instance.updateIssue(this.props.issue, { state: value || null });
  }
};
