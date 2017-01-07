import * as React from 'react';
import { IIssue } from '../../application';

require('./index.less');

interface IssueDetailProps {
  issue: IIssue;
}

interface IIssueDetailState {
}

export default class IssueDetail extends React.Component<IssueDetailProps, IIssueDetailState> {
  render() {
    return (
      <div className="issue-detail component">
        <div className="header">Issue #{this.props.issue.sid}</div>
      </div>
    );
  }
};