import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import UserField from '../user-field';

interface IIssueAssignedToFieldProps {
  issue: IIssue;
}

interface IIssueAssignedToFieldState {
}

export default class IssueAssignedToField extends React.PureComponent<IIssueAssignedToFieldProps, IIssueAssignedToFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const assignedTo = this.application.users.get(this.props.issue.assignedTo);

    return (
      <UserField user={assignedTo} className="issue-assigned-to-field-component" />
    );
  }
};
