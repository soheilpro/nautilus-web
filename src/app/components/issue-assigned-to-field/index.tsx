import * as React from 'react';
import { IIssue } from '../../application';
import UserField from '../user-field';

interface IIssueAssignedToFieldProps {
  issue: IIssue;
}

interface IIssueAssignedToFieldState {
}

export default class IssueAssignedToField extends React.PureComponent<IIssueAssignedToFieldProps, IIssueAssignedToFieldState> {
  render() {
    return (
      <UserField user={this.props.issue.assignedTo} className="issue-assigned-to-field-component" />
    );
  }
};
