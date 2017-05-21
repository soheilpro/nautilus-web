import * as _ from 'underscore';
import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import List from '../list';
import Issue from './issue';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueListProps {
  issues?: IIssue[];
  selectedIssue?: IIssue;
  onIssueSelect?(issue: IIssue): void;
}

interface IIssueListState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class IssueList extends React.PureComponent<IIssueListProps, IIssueListState> {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(props: IIssueListProps) {
    super(props);

    this.handleListItemSelect = this.handleListItemSelect.bind(this);
    this.handleListItemAction = this.handleListItemAction.bind(this);
    this.handleListItemDelete = this.handleListItemDelete.bind(this);

    this.state = {
      issues: this.sortIssues(props.issues),
      selectedIssue: props.selectedIssue,
    };
  }

  componentWillReceiveProps(props: IIssueListProps) {
    this.setState({
      issues: this.sortIssues(props.issues),
      selectedIssue: props.selectedIssue,
    });
  }

  private handleListItemSelect(issue: IIssue) {
    if (this.props.onIssueSelect)
      this.props.onIssueSelect(issue);

    this.setState({
      selectedIssue: issue,
    });
  }

  private handleListItemAction(issue: IIssue) {
    return this.issueController.editIssue(issue);
  }

  private handleListItemDelete(issue: IIssue) {
    return this.issueController.deleteIssue(issue);
  }

  private sortIssues(issues: IIssue[]) {
    const findIssueById = _.memoize((id: string) => {
      return _.find(issues, issue => issue.id === id);
    });

    const getParents = (issue: IIssue): IIssue[] => {
      if (!issue.parentIssue)
        return [];

      const parent = findIssueById(issue.parentIssue.id);

      if (!parent)
        return [];

      return getParents(parent).concat(parent);
    };

    const issuesWithPath = issues.map(issue => {
      return {
        issue,
        path: getParents(issue).concat(issue).map(issue => issue.sid),
      };
    });

    issuesWithPath.sort((x, y) => {
      for (let i = 0; ; i++) {
        const xNode = x.path[i];
        const yNode = y.path[i];

        if (!xNode && !yNode)
          return 0;

        if (!xNode)
          return -1;

        if (!yNode)
          return 1;

        const result = -1 * xNode.localeCompare(yNode);

        if (result !== 0)
          return result;
      }
    });

    return issuesWithPath.map(issueWithPath => issueWithPath.issue);
  }

  render() {
    return (
      <List className="issue-list-component" items={this.state.issues} selectedItem={this.state.selectedIssue} Item={Issue} onItemSelect={this.handleListItemSelect} onItemAction={this.handleListItemAction} onItemDelete={this.handleListItemDelete} />
    );
  }
};
