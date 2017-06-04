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
    if (this.props.issues !== props.issues) {
      this.setState({
        issues: this.makeTree(props.issues),
      });
    }

    if (this.props.selectedIssue !== props.selectedIssue) {
      this.setState({
        selectedIssue: props.selectedIssue,
      });
    }
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
    interface IIssueWithChildren extends IIssue {
      __children: IIssue[];
    }

    // First find all sub-issues and add them as children to their parents
    const subIssues = issues.filter(issue => !!issue.parent);

    for (const subIssue of subIssues) {
      const parent = subIssue.parent as IIssueWithChildren;
      parent.__children = (parent.__children || []).concat(subIssue);

      const subIssueIndex = issues.indexOf(subIssue);
      issues.splice(subIssueIndex, 1);
    }

    // Now recursively turn that tree into a flat list
    function flatten(issues: IIssue[]) {
      let result: IIssue[] = [];

      for (const issue of issues as IIssueWithChildren[]) {
        result = [
          ...result,
          issue,
          ...(issue.__children ? flatten(issue.__children) : []),
        ];

        issue.__children = undefined;
      }

      return result;
    }

    return flatten(issues);
  }

  render() {
    return (
      <Table className={classNames('issue-table-component', this.props.className)} items={this.state.issues} selectedItem={this.state.selectedIssue} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
};
