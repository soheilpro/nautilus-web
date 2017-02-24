import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
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

export default class Dropdown extends React.Component<IDropdownProps, IDropdownState> {
  private rootElement: HTMLElement;
  private buttonElement: HTMLElement;
  private windowContainerComponent: WindowContainer;

  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleWindowContainerCloseRequest = this.handleWindowContainerCloseRequest.bind(this);

    this.state = {};
  }

  componentDidUpdate() {
    if (!this.windowContainerComponent)
      return;

    let windowContainerElement = ReactDOM.findDOMNode(this.windowContainerComponent) as HTMLElement;
    let windowContainerElementLeft = windowContainerElement.offsetLeft;
    let windowContainerElementWidth = windowContainerElement.offsetWidth;

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

  private handleButtonClick() {
    if (!this.state.isOpen)
      this.open();
    else
      this.close();
  }

  private handleWindowContainerCloseRequest() {
    this.close();
  }

  render() {
    return (
      <div className={classNames('dropdown-component', this.props.className, {'open': this.state.isOpen})} tabIndex={0} ref={e => this.rootElement = e}>
        <div className="button" onClick={this.handleButtonClick} ref={e => this.buttonElement = e}>
          {this.props.title}
          <Icon className="caret" name={this.state.isOpen ? 'caret-up' : 'caret-down'} />
        </div>
        {
          this.state.isOpen &&
            <WindowContainer position="absolute" blurCheckElement={this.rootElement} onCloseRequest={this.handleWindowContainerCloseRequest} ref={e => this.windowContainerComponent = e}>
              <Window className="window">
                {this.props.children}
              </Window>
            </WindowContainer>
        }
      </div>
    );
  }
};
