import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';

require('./index.less');

interface IModalProps {
  isOpen: boolean;
  top?: number;
  width?: number;
  onCloseRequest(): void;
}

interface IModalState {
}

export default class Modal extends React.Component<IModalProps, IModalState> {
  private containerElement: HTMLElement;

  static defaultProps = {
    top: 120,
    width: 600,
  };

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
    if (!this.props.isOpen)
      return null;

    return (
      <div className="modal component">
        <div className="container" style={{ top: this.props.top, left: `calc(100% / 2 - ${this.props.width}px / 2)`, width: this.props.width }} tabIndex={0} onKeyDown={this.handleContainerKeyDown} onBlur={this.handleContainerBlur} ref={e => this.containerElement = e}>
          {this.props.children}
        </div>
      </div>
    );
  }
};
