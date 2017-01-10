import * as React from 'react';
import { IIssue } from '../../application';

require('./index.less');

interface IIssueListProps {
  issues?: IIssue[];
  onSelectedIssueChange?(issue: IIssue): void;
}

interface IIssueListState {
}

export default class IssueList extends React.Component<IIssueListProps, IIssueListState> {
  constructor() {
    super();

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  private handleFocus(issue: IIssue) {
    if (this.props.onSelectedIssueChange)
      this.props.onSelectedIssueChange(issue);
  }

  private handleBlur() {
    if (this.props.onSelectedIssueChange)
      this.props.onSelectedIssueChange(null);
  }

  render() {
    return (
      <div className="issue-list component" onBlur={this.handleBlur}>
        {
          this.props.issues.map(issue => {
            return (
              <div className="issue" tabIndex={0} onFocus={this.handleFocus.bind(null, issue)} key={issue.id}>
                <span>{issue.sid}</span>
                <span>{issue.title}</span>
              </div>
            );
          })
        }
      </div>
    );
  }
};
