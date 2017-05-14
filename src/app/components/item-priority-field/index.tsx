import * as React from 'react';
import { IItemPriority } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemPriorityFieldProps {
  itemPriority: IItemPriority;
  style?: object;
}

interface IItemPriorityFieldState {
}

export default class ItemPriorityField extends React.PureComponent<IItemPriorityFieldProps, IItemPriorityFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.itemPriority)
      return null;

    const itemPriority = this.application.itemPriorities.get(this.props.itemPriority);

    return (
      <span className="item-priority-field-component" style={this.props.style}>
        {itemPriority.title}
      </span>
    );
  }
};
