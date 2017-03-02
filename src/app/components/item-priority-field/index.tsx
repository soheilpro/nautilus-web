import React from 'react';
import { IItemPriority } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemPriorityFieldProps {
  itemPriority: IItemPriority;
}

interface IItemPriorityFieldState {
}

export default class ItemPriorityField extends React.Component<IItemPriorityFieldProps, IItemPriorityFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.itemPriority)
      return null;

    const itemPriority = this.application.itemPriorities.get(this.props.itemPriority);

    return (
      <div className="item-priority-field-component">
        {itemPriority.title}
      </div>
    );
  }
};
