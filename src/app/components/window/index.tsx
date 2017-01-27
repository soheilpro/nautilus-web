import * as React from 'react';
import { KeyCode } from '../../keyboard';

require('./index.less');

interface IWindowProps {
  onCloseRequest(): void;
}

interface IWindowState {
}

export default class Window extends React.Component<IWindowProps, IWindowState> {
  private containerElement: HTMLElement;

  constructor() {
    super();

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleContainerBlur = this.handleContainerBlur.bind(this);
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.Escape) {
      event.preventDefault();

      this.props.onCloseRequest();
    }
  }

  private handleContainerBlur(event: React.FocusEvent<HTMLDivElement>) {
    setTimeout(() => {
      if (!this.containerElement)
        return;

      if (this.containerElement.contains(document.activeElement))
        return;

      this.props.onCloseRequest();
    }, 0);
  }

  render() {
    return (
      <div className="window component">
        <div className="container" tabIndex={0} onKeyDown={this.handleContainerKeyDown} onBlur={this.handleContainerBlur} ref={e => this.containerElement = e}>
          {this.props.children}
        </div>
      </div>
    );
  }
};

export * from './header'
export * from './content'
export * from './action-bar'
