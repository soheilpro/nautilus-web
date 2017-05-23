import * as React from 'react';
import * as classNames from 'classnames';
import Dropdown from '../dropdown';
import ItemList from './item-list';
import { ISelectItem } from './iselect-item';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISelectProps {
  items: ISelectItem[];
  selectedItem: ISelectItem;
  displayProperty: string;
  placeholder?: string;
  className?: string;
  onChange(item: ISelectItem): void;
}

interface ISelectState {
}

export default class Select extends React.PureComponent<ISelectProps, ISelectState> {
  private dropdownComponent: Dropdown;

  constructor() {
    super();

    this.handleItemListSelect = this.handleItemListSelect.bind(this);
  }

  private handleItemListSelect(item: ISelectItem) {
    this.dropdownComponent.close();
    this.dropdownComponent.focus();
    this.props.onChange(item);
  }

  private getDropdownTitle() {
    return (
      <span className={classNames('title', { 'placeholder': !this.props.selectedItem })}>
        {
          this.props.selectedItem ?
            this.props.selectedItem[this.props.displayProperty] :
            this.props.placeholder
        }
      </span>
    );
  }

  render() {
    return (
      <div className={classNames('select-component', this.props.className)}>
        <Dropdown className="dropdown" title={this.getDropdownTitle()} ref={e => this.dropdownComponent = e}>
          <ItemList items={this.props.items} selectedItem={this.props.selectedItem} displayProperty={this.props.displayProperty} onSelect={this.handleItemListSelect} />
        </Dropdown>
      </div>
    );
  }
};
