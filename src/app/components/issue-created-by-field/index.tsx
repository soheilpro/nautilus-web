import * as React from 'react';
import { IIssue } from '../../application';
import UserField from '../user-field';

interface IIssueCreatedByFieldProps {
  issue: IIssue;
}

interface IIssueCreatedByFieldState {
}

export default class IssueCreatedByField extends React.PureComponent<IIssueCreatedByFieldProps, IIssueCreatedByFieldState> {
  render() {
    return (
      <UserField user={this.props.issue.createdBy} className="issue-created-by-field-component" />
    );
  }
};
