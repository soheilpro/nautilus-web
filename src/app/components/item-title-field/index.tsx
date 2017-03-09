import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemTitleFieldProps {
  title: string;
}

interface IItemTitleFieldState {
}

export default class ItemTitleField extends React.Component<IItemTitleFieldProps, IItemTitleFieldState> {
  render() {
    return (
      <div className="item-title-field-component">
        {this.props.title}
      </div>
    );
  }
};
