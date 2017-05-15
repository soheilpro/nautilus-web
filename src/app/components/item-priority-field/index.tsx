import * as React from 'react';
import * as classNames from 'classnames';
import { IItemPriority } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemPriorityFieldProps {
  itemPriority: IItemPriority;
  className?: string;
}

interface IItemPriorityFieldState {
}

export default class ItemPriorityField extends React.PureComponent<IItemPriorityFieldProps, IItemPriorityFieldState> {
  render() {
    if (!this.props.itemPriority)
      return null;

    return (
      <span className={classNames('item-priority-field-component', `priority-${this.props.itemPriority.key}`, this.props.className)}>
        {this.props.itemPriority.title}
      </span>
    );
  }
};
