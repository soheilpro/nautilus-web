import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Icon from '../icon';
import Window, { WindowContainer } from '../window';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDropdownProps {
  title: string;
  className?: string;
  onOpen?(): void;
  onClose?(): void;
}

interface IDropdownState {
  isOpen?: boolean;
}

export default class Dropdown extends React.PureComponent<IDropdownProps, IDropdownState> {
  private componentElement: HTMLElement;
  private buttonElement: HTMLElement;
  private windowContainerComponent: WindowContainer;

  constructor() {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonKeyDown = this.handleButtonKeyDown.bind(this);
    this.handleWindowContainerCloseRequest = this.handleWindowContainerCloseRequest.bind(this);

    this.state = {};
  }

  componentDidUpdate() {
    if (!this.windowContainerComponent)
      return;

    const windowContainerElement = ReactDOM.findDOMNode(this.windowContainerComponent) as HTMLElement;
    const windowContainerElementLeft = windowContainerElement.offsetLeft;
    const windowContainerElementWidth = windowContainerElement.offsetWidth;

    if (windowContainerElementLeft + windowContainerElementWidth <= window.innerWidth)
      return;

    windowContainerElement.style.left = (this.buttonElement.offsetLeft + this.buttonElement.offsetWidth - windowContainerElementWidth) + 'px';
  }

  open() {
    this.setState({
      isOpen: true,
    });

    if (this.props.onOpen)
      this.props.onOpen();
  }

  close() {
    this.setState({
      isOpen: false,
    });

    if (this.props.onClose)
      this.props.onClose();
  }

  focus() {
    this.buttonElement.focus();
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.Escape) {
      if (this.state.isOpen) {
        event.preventDefault();
        event.stopPropagation();

        this.close();
        this.focus();
      }
    }
  }

  private handleButtonClick() {
    if (!this.state.isOpen)
      this.open();
    else
      this.close();
  }

  private handleButtonKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (!this.state.isOpen)
        this.open();
      else
        this.close();
    }
  }

  private handleWindowContainerCloseRequest() {
    this.close();
  }

  render() {
    return (
      <div className={classNames('dropdown-component', this.props.className, {'open': this.state.isOpen})} onKeyDown={this.handleKeyDown} ref={e => this.componentElement = e}>
        <div className="button" tabIndex={0} onClick={this.handleButtonClick} onKeyDown={this.handleButtonKeyDown} ref={e => this.buttonElement = e}>
          {this.props.title}
          <Icon className="caret" name={this.state.isOpen ? 'caret-up' : 'caret-down'} />
        </div>
        {
          this.state.isOpen &&
            <WindowContainer blurCheckElement={this.componentElement} onCloseRequest={this.handleWindowContainerCloseRequest} ref={e => this.windowContainerComponent = e}>
              <Window className="window">
                {this.props.children}
              </Window>
            </WindowContainer>
        }
      </div>
    );
  }
};
