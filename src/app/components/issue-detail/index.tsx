import * as React from 'react';
import { IIssue } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueDetailProps {
  issue: IIssue;
}

interface IIssueDetailState {
}

export default class IssueDetail extends React.PureComponent<IIssueDetailProps, IIssueDetailState> {
  render() {
    return (
      <div className="issue-detail-component">
        <div className="header">Issue #{this.props.issue.sid}</div>
        <div className="description">
          {this.props.issue.description}
        </div>
      </div>
    );
  }
};
