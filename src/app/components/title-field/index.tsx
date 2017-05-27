import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTitleFieldProps {
  title: string;
  state: IItemState;
}

interface IIssueTitleFieldState {
}

export default class IssueTitleField extends React.PureComponent<IIssueTitleFieldProps, IIssueTitleFieldState> {
  render() {
    return (
      <span className={classNames('title-field-component', this.props.state ? `state-${this.props.state.key}` : null)}>
        {this.props.title}
      </span>
    );
  }
};
