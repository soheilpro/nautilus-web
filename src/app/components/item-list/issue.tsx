import * as React from 'react';
import { IIssue } from '../../application';
import ProjectField from '../project-field';
import IssueTypeField from '../issue-type-field';
import IssuePriorityField from '../issue-priority-field';
import IssueStateField from '../issue-state-field';

require('./issue.less');

interface IIssueProps {
  issue: IIssue;
}

interface IIssueState {
}

export default class Issue extends React.Component<IIssueProps, IIssueState> {
  render() {
    return (
      <div className="issue component">
        <span className="sid">{this.props.issue.sid}</span>
        <span className="title">{this.props.issue.title}</span>
        {
          this.props.issue.project ?
            <span className="project"><ProjectField project={this.props.issue.project} /></span>
            : null
        }
        {
          this.props.issue.type ?
            <span className="type"><IssueTypeField issueType={this.props.issue.type} /></span>
            : null
        }
        {
          this.props.issue.priority ?
            <span className="priority"><IssuePriorityField issuePriority={this.props.issue.priority} /></span>
            : null
        }
        {
          this.props.issue.state ?
            <span className="state"><IssueStateField issueState={this.props.issue.state} /></span>
            : null
        }
      </div>
    );
  }
};
