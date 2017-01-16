import * as React from 'react';

require('./action-bar.less');

interface IWindowActionBarProps {
}

interface IWindowActionBarState {
}

export class WindowActionBar extends React.Component<IWindowActionBarProps, IWindowActionBarState> {
  render() {
    return (
      <div className="window-action-bar component">
        {this.props.children}
      </div>
    );
  }
};
