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

require('../../assets/stylesheets/base.less');
require('./issue.less');

interface IIssueProps {
  item: IIssue;
  index: number;
  isSelected: boolean;
  onSelect?(): void;
  onAction?(): void;
}

interface IIssueState {
}

export default class Issue extends React.PureComponent<IIssueProps, IIssueState> {
  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
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
      <div className={classNames('issue-component', 'list-item', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        <div className="list-field sid">
          <IssueSidField issue={this.props.item} bold={this.props.isSelected} />
        </div>
        <div className="list-field title">
          <IssueTitleField issue={this.props.item} />
          <ItemPriorityIndicator className="priority-indicator" itemPriority={this.props.item.priority} />
        </div>
        <div className="list-field project">
          <IssueProjectField issue={this.props.item} />
        </div>
        <div className="list-field type">
          <IssueTypeField issue={this.props.item} />
        </div>
        <div className="list-field priority">
          <IssuePriorityField issue={this.props.item} />
        </div>
        <div className="list-field state">
          <IssueStateField issue={this.props.item} />
        </div>
        <div className="list-field assigned-to">
          <IssueAssignedTo issue={this.props.item} />
        </div>
        <div className="list-field milestone">
          <IssueMilestoneField issue={this.props.item} />
        </div>
      </div>
    );
  }
};
