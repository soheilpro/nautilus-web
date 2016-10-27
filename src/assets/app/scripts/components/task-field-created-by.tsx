import * as React from 'react';
import { Nautilus, IUser } from '../nautilus';
import { TaskField } from './task-field';

export class CreatedByTaskField extends TaskField {
  getValue(): IUser {
    return this.props.task.getCreatedBy();
  }

  valueToString(value: IUser) {
    return value ? value.name : '';
  }

  isEditable(): boolean {
    return false;
  }
};
