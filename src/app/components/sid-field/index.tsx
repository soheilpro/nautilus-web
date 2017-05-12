import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISidFieldProps {
  sid: string;
}

interface ISidFieldState {
}

export default class SidField extends React.PureComponent<ISidFieldProps, ISidFieldState> {
  render() {
    return (
      <span className="sid-field-component">
        {this.props.sid}
      </span>
    );
  }
};
