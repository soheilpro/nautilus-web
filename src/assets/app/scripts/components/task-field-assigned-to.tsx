import * as React from 'react';
import { Nautilus, IUser } from '../nautilus';
import { TaskField } from './task-field';

export class AssignedToTaskField extends TaskField {
  getPlaceholder(): string {
    return "Assigned To";
  }

  getValue(): IUser {
    return this.props.task.getAssignedTo();
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
    Nautilus.Instance.updateTask(this.props.task, { assignedTo: value || null });
  }
};
