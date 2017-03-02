import React from 'react';
import { KeyCode } from '../../keyboard';

interface IWindowContainerProps {
  position?: 'absolute' | 'fixed';
  top?: number;
  width?: number;
  closeOnBlur?: boolean;
  closeOnEsc?: boolean;
  blurCheckElement?: HTMLElement;
  onCloseRequest?(): void;
}

interface IWindowContainerState {
  zIndex?: number;
}

export class WindowContainer extends React.Component<IWindowContainerProps, IWindowContainerState> {
  static defaultProps = {
    position: 'fixed',
    closeOnBlur: true,
    closeOnEsc: true,
  };

  private static zIndexCounter = 1000;

  private rootElement?: HTMLElement;

  constructor() {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.state = {
      zIndex: WindowContainer.zIndexCounter++,
    };
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.Escape) {
      event.preventDefault();

      if (this.props.closeOnEsc)
        this.props.onCloseRequest();
    }
  }

  private handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!this.props.closeOnBlur)
      return;

    setTimeout(() => {
      if ((this.props.blurCheckElement || this.rootElement).contains(document.activeElement))
        return;

      if (this.props.closeOnEsc)
        this.props.onCloseRequest();
    }, 0);
  }

  render() {
    return (
      <div className="window-container-component" style={{ position: this.props.position, top: this.props.top, left: `calc(100% / 2 - ${this.props.width}px / 2)`, width: this.props.width, zIndex: this.state.zIndex }} tabIndex={0} onKeyDown={this.handleKeyDown} onBlur={this.handleBlur} ref={e => this.rootElement = e}>
        {this.props.children}
      </div>
    );
  }
};
