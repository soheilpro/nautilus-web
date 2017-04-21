import * as React from 'react';
import { IItem } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemFieldProps {
  item: IItem;
}

interface IItemFieldState {
  item?: IItem;
}

export default class ItemField extends React.PureComponent<IItemFieldProps, IItemFieldState> {
  private application = ServiceManager.Instance.getApplication();

  constructor(props: IItemFieldProps) {
    super(props);

    this.state = {};

    this.application.items.get(props.item).then(item => {
      this.setState({
        item,
      });
    });
  }

  async componentWillReceiveProps(props: IItemFieldProps) {
    this.setState({
      item: await this.application.items.get(props.item),
    });
  }

  render() {
    if (!this.state.item)
      return null;

    return (
      <div className="item-field-component">
        {this.state.item.title}
      </div>
    );
  }
};
