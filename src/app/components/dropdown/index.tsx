import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import Icon from '../icon';
import Window from '../window';

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
  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);

    this.state = {};
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

  render() {
    return (
      <div className={classNames('dropdown-component', this.props.className, {'open': this.state.isOpen})}>
        <div className="button" onClick={this.handleButtonClick}>
          {this.props.title}
          <Icon className="caret" name={this.state.isOpen ? 'caret-up' : 'caret-down'} />
        </div>
        {
          this.state.isOpen ?
            <Window className="content">
              {this.props.children}
            </Window>
            : null
        }
      </div>
    );
  }
};
