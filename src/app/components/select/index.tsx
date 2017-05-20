import * as React from 'react';
import * as classNames from 'classnames';
import Dropdown from '../dropdown';
import Icon from '../icon';
import ItemList from './item-list';
import { IItem } from './iitem';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISelectProps {
  items: IItem[];
  selectedItem: IItem;
  displayProperty: string;
  className?: string;
  onChange(item: IItem): void;
}

interface ISelectState {
}

export default class Select extends React.PureComponent<ISelectProps, ISelectState> {
  private dropdownComponent: Dropdown;

  constructor() {
    super();

    this.handleItemListSelect = this.handleItemListSelect.bind(this);
    this.handleClearClick = this.handleClearClick.bind(this);
  }

  private handleItemListSelect(item: IItem) {
    this.dropdownComponent.close();
    this.dropdownComponent.focus();
    this.props.onChange(item);
  }

  private handleClearClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.handleItemListSelect(null);
  }

  render() {
    return (
      <div className={classNames('select-component', this.props.className)}>
        <Dropdown title={this.props.selectedItem && this.props.selectedItem[this.props.displayProperty]} ref={e => this.dropdownComponent = e}>
          <ItemList items={this.props.items} displayProperty={this.props.displayProperty} onSelect={this.handleItemListSelect} />
        </Dropdown>
        {
          this.props.selectedItem &&
            <a className="clear" href="#" onClick={this.handleClearClick}>
              <Icon name="remove" />
            </a>
        }
      </div>
    );
  }
};
