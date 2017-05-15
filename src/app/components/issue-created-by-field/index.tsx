import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import UserField from '../user-field';

interface IIssueCreatedByFieldProps {
  issue: IIssue;
}

interface IIssueCreatedByFieldState {
}

export default class IssueCreatedByField extends React.PureComponent<IIssueCreatedByFieldProps, IIssueCreatedByFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const createdBy = this.application.users.get(this.props.issue.createdBy);

    return (
      <UserField user={createdBy} className="issue-created-by-field-component" />
    );
  }
};
