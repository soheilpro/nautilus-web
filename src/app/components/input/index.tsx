import * as React from 'react';
import * as classNames from 'classnames';

require('./index.less');

interface IInputProps {
  value: string;
  placeholder?: string;
  secret?: boolean;
  multiline?: boolean;
  autoFocus?: boolean;
  className?: string;
  onChange(value: string): void;
}

interface IInputState {
}

export default class Input extends React.Component<IInputProps, IInputState> {
  static defaultProps = {
    value: '',
  };

  constructor() {
    super();

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
  }

  private handleInputChange(event: React.FormEvent<HTMLInputElement>) {
    let value = (event.target as HTMLInputElement).value;

    this.props.onChange(value);
  }

  private handleTextAreaChange(event: React.FormEvent<HTMLTextAreaElement>) {
    let value = (event.target as HTMLTextAreaElement).value;

    this.props.onChange(value);
  }

  render() {
    return (
      this.props.multiline ?
        <textarea className={classNames('input component', this.props.className)} value={this.props.value} placeholder={this.props.placeholder} autoFocus={this.props.autoFocus} onChange={this.handleTextAreaChange} />
        :
        <input className={classNames('input component', this.props.className)} type={this.props.secret ? 'password' : 'text'} value={this.props.value} placeholder={this.props.placeholder} autoFocus={this.props.autoFocus} onChange={this.handleInputChange} />
    );
  }
};
