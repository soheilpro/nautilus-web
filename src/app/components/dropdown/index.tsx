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

  private handleButtonClick() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
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
