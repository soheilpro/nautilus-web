import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ISidFieldProps {
  sid: string;
}

interface ISidFieldState {
}

export default class SidField extends React.Component<ISidFieldProps, ISidFieldState> {
  render() {
    return (
      <div className="sid-field-component">
        {this.props.sid}
      </div>
    );
  }
};
