import * as React from 'react';
import { Editable } from './editable';

interface IssueFieldProps {
  issue;
}

export class IssueField extends React.Component<IssueFieldProps, {}> {
  private editable;

  getItem() {
    return null;
  }

  getItems() {
    return null;
  }

  itemToString(item) {
    return item;
  }

  itemFromString(value, items) {
    return value;
  }

  itemComparer(value1, value2) {
    return value1 === value2;
  }

  getEditableSpanStyle() {
    return {};
  }

  edit() {
    this.editable.startEditing();
  }

  onChanged(value) {
  }

  render() {
    return (
      <Editable item={this.getItem()} items={this.getItems()} itemToString={this.itemToString} itemFromString={this.itemFromString} itemComparer={this.itemComparer.bind(this)} spanStyle={this.getEditableSpanStyle()} onItemChanged={this.onChanged.bind(this)} ref={(e) => this.editable = e} />
    );
  }
};
