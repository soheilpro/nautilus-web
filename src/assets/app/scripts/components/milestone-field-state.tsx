import * as React from 'react';
import { Nautilus, IItemState } from '../nautilus';
import { MilestoneField } from './milestone-field';

export class StateMilestoneField extends MilestoneField {
  getValue(): IItemState {
    return this.props.milestone.getState();
  }

  getValues(): IItemState[] {
    return Nautilus.Instance.getItemStates();
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
    Nautilus.Instance.updateMilestone(this.props.milestone, { state: value || null });
  }
};
