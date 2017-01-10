import * as React from 'react';
import * as classNames from 'classnames';

require('./index.less');

interface IButtonProps {
  type?: 'primary' | 'secondary' | 'submit';
  className?: string;
  onClick?(): void;
}

interface IButtonState {
}

export default class Button extends React.Component<IButtonProps, IButtonState> {
  static defaultProps = {
    type: 'primary',
  };

  constructor() {
    super();

    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  private handleButtonClick() {
    if (this.props.onClick)
      this.props.onClick();
  }

  render() {
    return (
      <button className={classNames('button component', this.props.type, this.props.className)} onClick={this.handleButtonClick}>{this.props.children}</button>
    );
  }
};
