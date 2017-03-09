import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITextFieldProps {
  title: string;
}

interface ITextFieldState {
}

export default class TextField extends React.Component<ITextFieldProps, ITextFieldState> {
  render() {
    return (
      <div className="text-field-component">
        {this.props.title}
      </div>
    );
  }
};
