import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTitleFieldProps {
  issue: IIssue;
}

interface IIssueTitleFieldState {
}

export default class IssueTitleField extends React.PureComponent<IIssueTitleFieldProps, IIssueTitleFieldState> {
  render() {
    return (
      <span className={classNames('issue-title-field-component', this.props.issue.state ? `state-${this.props.issue.state.key}` : null)}>
        {this.props.issue.title}
      </span>
    );
  }
};
