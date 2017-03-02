import React from 'react';

require('../../assets/stylesheets/base.less');
require('./window-action-bar.less');

interface IWindowActionBarProps {
}

interface IWindowActionBarState {
}

export class WindowActionBar extends React.Component<IWindowActionBarProps, IWindowActionBarState> {
  render() {
    return (
      <div className="window-action-bar-component">
        {this.props.children}
      </div>
    );
  }
};
