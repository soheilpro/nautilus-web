import * as React from 'react';

require('./content.less');

interface IWindowContentProps {
}

interface IWindowContentState {
}

export class WindowContent extends React.Component<IWindowContentProps, IWindowContentState> {
  render() {
    return (
      <div className="window-content component">
        {this.props.children}
      </div>
    );
  }
};
