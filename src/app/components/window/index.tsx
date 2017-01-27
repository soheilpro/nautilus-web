import * as React from 'react';

require('./index.less');

interface IWindowProps {
}

interface IWindowState {
}

export default class Window extends React.Component<IWindowProps, IWindowState> {
  render() {
    return (
      <div className="window component">
        {this.props.children}
      </div>
    );
  }
};

export * from './header'
export * from './content'
export * from './action-bar'
