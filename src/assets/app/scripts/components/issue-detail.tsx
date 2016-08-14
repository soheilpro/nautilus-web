import * as React from 'react';
import { Nautilus, IIssue } from '../nautilus';
import { DescriptionIssueField } from './issue-field-description';
import { CreatorIssueField } from './issue-field-creator';

interface IssueDetailProps {
  issue: IIssue;
}

export class IssueDetail extends React.Component<IssueDetailProps, {}> {
  render() {
    return (
      <div className='issue-detail'>
        <div className='header'>Issue</div>
        <DescriptionIssueField issue={this.props.issue} />
        <br />

        <strong>Creator:</strong>
        <CreatorIssueField issue={this.props.issue} />
      </div>
    );
  }
};
