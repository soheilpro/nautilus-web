import * as React from 'react';
import { IIssue } from '../../application';
import SidField from '../sid-field';
import IssueTitleField from '../issue-title-field';
import IssuePriorityField from '../issue-priority-field';
import IssueProjectField from '../issue-project-field';
import IssueTypeField from '../issue-type-field';
import IssueStateField from '../issue-state-field';
import IssueAssignedTo from '../issue-assigned-to-field';
import IssueMilestoneField from '../issue-milestone-field';

require('../../assets/stylesheets/base.less');
require('./issue.less');

interface IIssueProps {
  issue: IIssue;
}

interface IIssueState {
}

export default class Issue extends React.PureComponent<IIssueProps, IIssueState> {
  render() {
    return (
      <div className="issue-component">
        <span className="sid">
          <SidField sid={this.props.issue.sid} />
        </span>
        <span className="divider1"></span>
        {
          <span className="title">
            <IssueTitleField issue={this.props.issue} />
          </span>
        }
        {
          this.props.issue.priority &&
            <span className="priority">
              <span className="divider2"></span>
              <IssuePriorityField issue={this.props.issue} />
            </span>
        }
        <span className="spacer"></span>
        {
          this.props.issue.project &&
            <span className="project">
              <span className="divider2"></span>
              <IssueProjectField issue={this.props.issue} />
            </span>
        }
        {
          this.props.issue.type &&
            <span className="type">
              <span className="divider2"></span>
              <IssueTypeField issue={this.props.issue} />
            </span>
        }
        {
          this.props.issue.state &&
            <span className="state">
              <span className="divider2"></span>
              <IssueStateField issue={this.props.issue} />
            </span>
        }
        {
          this.props.issue.assignedTo &&
            <span className="assigned-to">
              <span className="divider2"></span>
              <IssueAssignedTo issue={this.props.issue} />
            </span>
        }
        {
          this.props.issue.parent &&
            <span className="milestone">
              <span className="divider2"></span>
              <IssueMilestoneField issue={this.props.issue} />
            </span>
        }
      </div>
    );
  }
};
