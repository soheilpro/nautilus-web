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

  itemFromString(item, items) {
    return item;
  }

  itemComparer(item1, item2) {
    return item1 === item2;
  }

  getEditableSpanStyle() {
    return {};
  }

  edit() {
    this.editable.startEditing();
  }

  setItem(item) {
  }

  render() {
    return (
      <Editable item={this.getItem()} items={this.getItems()} itemToString={this.itemToString} itemFromString={this.itemFromString} itemComparer={this.itemComparer.bind(this)} spanStyle={this.getEditableSpanStyle()} onItemChanged={this.setItem.bind(this)} ref={(e) => this.editable = e} />
    );
  }
};
