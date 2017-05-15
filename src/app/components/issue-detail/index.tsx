import * as React from 'react';
import { IIssue } from '../../application';
import IssueDescriptionField from '../issue-description-field';
import IssueCreatedByField from '../issue-created-by-field';

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
          <IssueDescriptionField issue={this.props.issue} />
        </div>
        <div className="created">
          <div className="label">Created by:</div>
          <div className="user">
            <IssueCreatedByField issue={this.props.issue} />
          </div>
        </div>
      </div>
    );
  }
};
