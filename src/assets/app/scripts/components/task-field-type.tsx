import * as React from 'react';
import { Nautilus, IItemType } from '../nautilus';
import { TaskField } from './task-field';

export class TypeTaskField extends TaskField {
  getPlaceholder(): string {
    return "Type";
  }

  getValue(): IItemType {
    return this.props.task.getType();
  }

  getValues(): IItemType[] {
    return Nautilus.Instance.getTaskTypes();
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
    Nautilus.Instance.updateTask(this.props.task, { type: value || null });
  }
};
