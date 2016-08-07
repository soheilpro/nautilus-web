import * as React from 'react';
import { Editable } from './editable';
import { IIssue } from '../nautilus';

interface IssueFieldProps {
  issue: IIssue;
}

export class IssueField extends React.Component<IssueFieldProps, {}> {
  private editable: Editable;

  isEditable(): boolean {
    return true;
  }

  getValue(): any {
    return null;
  }

  getValues(): any[] {
    return null;
  }

  valueToString(value: any): string {
    return value;
  }

  valueFromString(value: string, values: any[]): any {
    return value;
  }

  valueComparer(value1: any, value2: any): boolean {
    return value1 === value2;
  }

  getEditableSpanStyle(): Object {
    return {};
  }

  edit(): void {
    this.editable.startEditing();
  }

  setValue(value: any): void {
  }

  render() {
    return (
      <Editable isEditable={this.isEditable()} value={this.getValue()} values={this.getValues()} valueToString={this.valueToString} valueFromString={this.valueFromString} valueComparer={this.valueComparer.bind(this)} spanStyle={this.getEditableSpanStyle()} onValueChanged={this.setValue.bind(this)} ref={(e) => this.editable = e} />
    );
  }
};
