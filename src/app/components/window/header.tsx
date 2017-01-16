import * as React from 'react';

require('./header.less');

interface IWindowHeaderProps {
}

interface IWindowHeaderState {
}

export class WindowHeader extends React.Component<IWindowHeaderProps, IWindowHeaderState> {
  render() {
    return (
      <div className="window-header component">
        <span className="title">{this.props.children}</span>
      </div>
    );
  }
};
