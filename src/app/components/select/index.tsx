import _ from 'underscore';
import React from 'react';
import classNames from 'classnames';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISelectItem {
  id?: string;
  [key: string]: any;
}

interface ISelectProps {
  items: ISelectItem[];
  selectedItem: ISelectItem;
  displayProperty: string;
  className?: string;
  onChange(item: ISelectItem): void;
}

interface ISelectState {
}

export default class Select extends React.Component<ISelectProps, ISelectState> {
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
      <select className={classNames('select-component', this.props.className)} value={this.props.selectedItem ? this.props.selectedItem.id : ''} onChange={this.handleSelectChange}>
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
