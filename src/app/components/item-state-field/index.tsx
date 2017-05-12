import * as React from 'react';
import { IItemState } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemStateFieldProps {
  itemState: IItemState;
}

interface IItemStateFieldState {
}

export default class ItemStateField extends React.PureComponent<IItemStateFieldProps, IItemStateFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.itemState)
      return null;

    const itemState = this.application.itemStates.get(this.props.itemState);

    return (
      <span className="item-state-field-component">
        {itemState.title}
      </span>
    );
  }
};
