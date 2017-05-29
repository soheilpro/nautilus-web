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
      selectedIssue: props.selectedIssue,
    };
  }

  componentWillReceiveProps(props: IIssueTableProps) {
    if (this.props.issues === props.issues && this.props.selectedIssue === props.selectedIssue)
      return;

    this.setState({
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

  render() {
    return (
      <Table className={classNames('issue-table-component', this.props.className)} items={this.props.issues} selectedItem={this.state.selectedIssue} Header={TableHeader} Row={TableRow} Footer={TableFooter} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
};
