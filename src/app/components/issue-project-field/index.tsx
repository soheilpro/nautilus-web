import * as React from 'react';
import { IIssue } from '../../application';
import ProjectField from '../project-field';

interface IIssueProjectFieldProps {
  issue: IIssue;
}

interface IIssueProjectFieldState {
}

export default class IssueProjectField extends React.PureComponent<IIssueProjectFieldProps, IIssueProjectFieldState> {
  render() {
    return (
      <ProjectField project={this.props.issue.project} className="issue-project-field-component" />
    );
  }
};
