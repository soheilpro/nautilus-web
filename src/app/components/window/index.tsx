import * as React from 'react';
import * as classNames from 'classnames';

require('./index.less');

interface IWindowProps {
  className?: string;
}

interface IWindowState {
}

export default class Window extends React.Component<IWindowProps, IWindowState> {
  render() {
    return (
      <div className={classNames('window component', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
};

export * from './header'
export * from './content'
export * from './action-bar'
