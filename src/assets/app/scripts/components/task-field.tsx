import * as React from 'react';
import { Editable } from './editable';
import { ITask } from '../nautilus';

interface TaskFieldProps {
  task: ITask;
}

export class TaskField extends React.Component<TaskFieldProps, {}> {
  private editable: Editable;

  isEditable(): boolean {
    return true;
  }

  isMultiline(): boolean {
    return false;
  }

  getPlaceholder(): string {
    return null;
  }

  getValue(): any {
    return null;
  }

  getValues(): any[] {
    return null;
  }

  getStyle(): Object {
    return null;
  }

  valueToString(value: any, full: boolean): string {
    return value;
  }

  valueFromString(value: string, values: any[]): any {
    return value;
  }

  valueComparer(value1: any, value2: any): boolean {
    return value1 === value2;
  }

  edit(): void {
    this.editable.startEditing();
  }

  setValue(value: any): void {
  }

  render() {
    return (
      <Editable isEditable={this.isEditable()} isMultiline={this.isMultiline()} placeholder={this.getPlaceholder()} value={this.getValue()} values={this.getValues()} style={this.getStyle()} valueToString={this.valueToString} valueFromString={this.valueFromString} valueComparer={this.valueComparer.bind(this)} onValueChanged={this.setValue.bind(this)} ref={(e) => this.editable = e} />
    );
  }
};
