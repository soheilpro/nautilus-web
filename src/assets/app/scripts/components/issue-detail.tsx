import * as React from 'react';
import { Nautilus, IIssue } from '../nautilus';
import { DescriptionIssueField } from './issue-field-description';
import { AreaIssueField } from './issue-field-area';
import { PriorityIssueField } from './issue-field-priority';
import { CreatorIssueField } from './issue-field-creator';

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

        <strong>Area:</strong>
        <AreaIssueField issue={this.props.issue} />
        <br />

        <strong>Creator:</strong>
        <CreatorIssueField issue={this.props.issue} />
      </div>
    );
  }
};
