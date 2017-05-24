import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import Table from '../table';
import TableHeader from './table-header';
import TableRow from './table-row';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTableProps {
  issues?: IIssue[];
  selectedIssue?: IIssue;
  className?: string;
  onIssueSelect?(issue: IIssue): void;
}

interface IIssueTableState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class IssueTable extends React.PureComponent<IIssueTableProps, IIssueTableState> {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(props: IIssueTableProps) {
    super(props);

    this.handleTableItemSelect = this.handleTableItemSelect.bind(this);
    this.handleTableItemAction = this.handleTableItemAction.bind(this);
    this.handleTableItemDelete = this.handleTableItemDelete.bind(this);

    this.state = {
      issues: this.sortIssues(props.issues),
      selectedIssue: props.selectedIssue,
    };
  }

  componentWillReceiveProps(props: IIssueTableProps) {
    this.setState({
      issues: this.sortIssues(props.issues),
      selectedIssue: props.selectedIssue,
    });
  }

  private handleTableItemSelect(issue: IIssue) {
    if (this.props.onIssueSelect)
      this.props.onIssueSelect(issue);

    this.setState({
      selectedIssue: issue,
    });
  }

  private handleTableItemAction(issue: IIssue) {
    return this.issueController.editIssue(issue);
  }

  private handleTableItemDelete(issue: IIssue) {
    return this.issueController.deleteIssue(issue);
  }

  private sortIssues(issues: IIssue[]) {
    const findIssueById = _.memoize((id: string) => {
      return _.find(issues, issue => issue.id === id);
    });

    const getParents = (issue: IIssue): IIssue[] => {
      if (!issue.parent)
        return [];

      const parent = findIssueById(issue.parent.id);

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
      <Table className={classNames('issue-table-component', this.props.className)} items={this.state.issues} selectedItem={this.state.selectedIssue} Header={TableHeader} Row={TableRow} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
};
