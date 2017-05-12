import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITextFieldProps {
  title: string;
  style?: object;
}

interface ITextFieldState {
}

export default class TextField extends React.PureComponent<ITextFieldProps, ITextFieldState> {
  render() {
    return (
      <span className="text-field-component" style={this.props.style}>
        {this.props.title}
      </span>
    );
  }
};
