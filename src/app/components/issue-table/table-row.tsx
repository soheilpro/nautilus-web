import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import IssueSidField from '../issue-sid-field';
import IssueTitleField from '../issue-title-field';
import IssuePriorityField from '../issue-priority-field';
import IssueProjectField from '../issue-project-field';
import IssueTypeField from '../issue-type-field';
import IssueStateField from '../issue-state-field';
import IssueAssignedTo from '../issue-assigned-to-field';
import IssueMilestoneField from '../issue-milestone-field';
import ItemPriorityIndicator from '../item-priority-indicator';
import { ITableRow } from '../table';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IIssue;
  index: number;
  isSelected: boolean;
  onSelect?(): void;
  onAction?(): void;
}

interface ITableRowState {
}

export default class TableRow extends React.PureComponent<ITableRowProps, ITableRowState> implements ITableRow {
  private componentElement: HTMLElement;

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  focus() {
    this.componentElement.focus();
  }

  private handleClick() {
    if (this.props.onSelect)
      this.props.onSelect();
  }

  private handleDoubleClick() {
    if (this.props.onAction)
      this.props.onAction();
  }

  render() {
    return (
      <div className={classNames('table-row-component', 'table-row', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} ref={e => this.componentElement = e}>
        <div className="table-cell sid">
          <IssueSidField issue={this.props.item} bold={this.props.isSelected} />
        </div>
        <div className="table-cell title">
          <IssueTitleField issue={this.props.item} />
          <ItemPriorityIndicator className="priority-indicator" itemPriority={this.props.item.priority} />
        </div>
        <div className="table-cell project">
          <IssueProjectField issue={this.props.item} />
        </div>
        <div className="table-cell type">
          <IssueTypeField issue={this.props.item} />
        </div>
        <div className="table-cell priority">
          <IssuePriorityField issue={this.props.item} />
        </div>
        <div className="table-cell state">
          <IssueStateField issue={this.props.item} />
        </div>
        <div className="table-cell assigned-to">
          <IssueAssignedTo issue={this.props.item} />
        </div>
        <div className="table-cell milestone">
          <IssueMilestoneField issue={this.props.item} />
        </div>
      </div>
    );
  }
};