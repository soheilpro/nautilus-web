import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import ProjectField from '../project-field';

interface IIssueProjectFieldProps {
  issue: IIssue;
}

interface IIssueProjectFieldState {
}

export default class IssueProjectField extends React.PureComponent<IIssueProjectFieldProps, IIssueProjectFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const project = this.application.projects.get(this.props.issue.project);

    return (
      <ProjectField project={project} className="issue-project-field-component" />
    );
  }
};
