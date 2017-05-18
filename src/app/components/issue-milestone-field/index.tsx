import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueMilestoneFieldProps {
  issue: IIssue;
}

interface IIssueMilestoneFieldState {
  issue?: IIssue;
}

export default class IssueMilestoneField extends React.PureComponent<IIssueMilestoneFieldProps, IIssueMilestoneFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const milestone = this.application.items.getMilestone(this.props.issue.milestone);

    if (!milestone)
      return null;

    return (
      <span className="issue-milestone-field-component">
        {milestone.title}
      </span>
    );
  }
};
