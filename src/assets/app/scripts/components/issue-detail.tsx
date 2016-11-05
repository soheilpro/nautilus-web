import * as React from 'react';
import { Nautilus, IIssue } from '../nautilus';
import { DescriptionIssueField } from './issue-field-description';
import { PriorityIssueField } from './issue-field-priority';
import { CreatedByIssueField } from './issue-field-created-by';

interface IssueDetailProps {
  issue: IIssue;
}

export class IssueDetail extends React.Component<IssueDetailProps, {}> {
  render() {
    return (
      <div className='issue-detail'>
        <div className='header'>Issue #{this.props.issue.sid}</div>
        <DescriptionIssueField issue={this.props.issue} />
        <br />

        <strong>Priority:</strong>
        <PriorityIssueField issue={this.props.issue} />
        <br />

        <strong>Created By:</strong>
        <CreatedByIssueField issue={this.props.issue} />
      </div>
    );
  }
};
