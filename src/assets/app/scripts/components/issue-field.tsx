import * as React from 'react';
import { Editable } from './editable';

interface IssueFieldProps {
  issue;
}

export class IssueField extends React.Component<IssueFieldProps, {}> {
  private editable;

  getValue() {
    return null;
  }

  getValues() {
    return null;
  }

  valueToString(value) {
    return value;
  }

  valueFromString(value, values) {
    return value;
  }

  valueComparer(value1, value2) {
    return value1 === value2;
  }

  getEditableSpanStyle() {
    return {};
  }

  edit() {
    this.editable.startEditing();
  }

  setValue(value) {
  }

  render() {
    return (
      <Editable value={this.getValue()} values={this.getValues()} valueToString={this.valueToString} valueFromString={this.valueFromString} valueComparer={this.valueComparer.bind(this)} spanStyle={this.getEditableSpanStyle()} onValueChanged={this.setValue.bind(this)} ref={(e) => this.editable = e} />
    );
  }
};
