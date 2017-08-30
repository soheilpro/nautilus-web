import * as React from 'react';
import * as classNames from 'classnames';
import { IItemPriority } from '../../application';
import Select from '../select';

interface IItemPrioritySelectProps {
  itemPriorities?: IItemPriority[];
  itemPriority: IItemPriority;
  className?: string;
  onChange(itemPriority: IItemPriority): void;
}

interface IItemPrioritySelectState {
}

export default class ItemPrioritySelect extends React.PureComponent<IItemPrioritySelectProps, IItemPrioritySelectState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(itemPriority: IItemPriority) {
    this.props.onChange(itemPriority);
  }

  render() {
    return (
      <Select className={classNames('item-priority-select-component', this.props.className)} selectedItem={this.props.itemPriority} items={this.props.itemPriorities} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
