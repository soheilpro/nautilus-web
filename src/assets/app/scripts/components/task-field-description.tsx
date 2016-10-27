import * as React from 'react';
import { Nautilus } from '../nautilus';
import { TaskField } from './task-field';

export class DescriptionTaskField extends TaskField {
  isMultiline() {
    return true;
  }

  getPlaceholder(): string {
    return "Enter description";
  }

  getValue(): string {
    return this.props.task.getDescription();
  }

  setValue(value: string): void {
    Nautilus.Instance.updateTask(this.props.task, { description: value });
  }
};
