import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import Table from '../table';
import TableHeader from './table-header';
import TableRow from './table-row';
import TableFooter from './table-footer';

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
      issues: this.makeTree(props.issues),
      selectedIssue: props.selectedIssue,
    };
  }

  componentWillReceiveProps(props: IIssueTableProps) {
    if (this.props.issues === props.issues && this.props.selectedIssue === props.selectedIssue)
      return;

    this.setState({
      issues: this.makeTree(props.issues),
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

  private makeTree(issues: IIssue[]) {
    // This method turns an ordered list of issues into a tree-like list where each sub-issue
    // is placed after its parent (and after any other sub-issues to preserve original order)

    issues = [...issues];

    const subIssues = issues.filter(issue => issue.parent);

    for (const subIssue of subIssues) {
      const parent = subIssue.parent;
      const subIssueIndex = issues.indexOf(subIssue);
      const parentIndex = issues.indexOf(parent);

      // Sub-issue must be placed after its parent
      let newSubIssueIndex = parentIndex + 1;

      // But after all other sub-issues so that the original list order is preserved
      while (issues[newSubIssueIndex].parent === parent)
        newSubIssueIndex++;

      if (newSubIssueIndex < subIssueIndex) {
        // Since sub-issue must be moved up, removing it first will not change the new position
        issues.splice(subIssueIndex, 1); // Remove
        issues.splice(newSubIssueIndex, 0, subIssue); // Add
      }
      else {
        // Since sub-issue must be moved down, adding it first will not change the old position
        issues.splice(newSubIssueIndex, 0, subIssue); // Add
        issues.splice(subIssueIndex, 1); // Remove
      }
    }

    return issues;
  }

  render() {
    return (
      <Table className={classNames('issue-table-component', this.props.className)} items={this.state.issues} selectedItem={this.state.selectedIssue} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
};
