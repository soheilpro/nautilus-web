import * as React from 'react';
import * as classNames from 'classnames';
import { ServiceManager } from '../../services';
import { IIssue } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTitleFieldProps {
  issue: IIssue;
}

interface IIssueTitleFieldState {
}

export default class IssueTitleField extends React.PureComponent<IIssueTitleFieldProps, IIssueTitleFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const state = this.application.itemStates.get(this.props.issue.state);

    return (
      <span className={classNames('issue-title-field-component', state ? `state-${state.key}` : null)}>
        {this.props.issue.title}
      </span>
    );
  }
};
