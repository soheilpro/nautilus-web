import * as React from 'react';
import { Nautilus } from '../nautilus';
import { TaskField } from './task-field';

export class TitleTaskField extends TaskField {
  getValue(): string {
    return this.props.task.getTitle();
  }

  setValue(value: string): void {
    Nautilus.Instance.updateTask(this.props.task, { title: value });
  }
};
