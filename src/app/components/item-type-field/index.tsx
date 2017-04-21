import * as React from 'react';
import { IItemType } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemTypeFieldProps {
  itemType: IItemType;
}

interface IItemTypeFieldState {
}

export default class ItemTypeField extends React.PureComponent<IItemTypeFieldProps, IItemTypeFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.itemType)
      return null;

    const itemType = this.application.itemTypes.get(this.props.itemType);

    return (
      <div className="item-type-field-component">
        {itemType.title}
      </div>
    );
  }
};
