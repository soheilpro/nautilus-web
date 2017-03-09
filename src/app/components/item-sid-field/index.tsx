import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemSidFieldProps {
  sid: string;
}

interface IItemSidFieldState {
}

export default class ItemSidField extends React.Component<IItemSidFieldProps, IItemSidFieldState> {
  render() {
    return (
      <div className="item-sid-field-component">
        {this.props.sid}
      </div>
    );
  }
};
