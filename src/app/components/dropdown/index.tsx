import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDropdownItem {
  id?: string;
  [key: string]: any;
}

interface IDropdownProps {
  items: IDropdownItem[];
  selectedItem: IDropdownItem;
  displayProperty: string;
  className?: string;
  onChange(item: IDropdownItem): void;
}

interface IDropdownState {
}

export default class Dropdown extends React.Component<IDropdownProps, IDropdownState> {
  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(event: React.FormEvent<HTMLSelectElement>) {
    let value = (event.target as HTMLSelectElement).value;
    let item = _.find(this.props.items, item => item.id === value);

    this.props.onChange(item);
  }

  render() {
    return (
      <select className={classNames('dropdown-component', this.props.className)} value={this.props.selectedItem ? this.props.selectedItem.id : ''} onChange={this.handleSelectChange}>
        <option></option>
        {
          this.props.items.map(item => {
            return (
              <option value={item.id} key={item.id}>{item[this.props.displayProperty]}</option>
            );
          })
        }
      </select>
    );
  }
};
