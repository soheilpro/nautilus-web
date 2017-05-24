import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import MilestoneSidField from '../milestone-sid-field';
import MilestoneTitleField from '../milestone-title-field';
import MilestoneProjectField from '../milestone-project-field';
import MilestoneStateField from '../milestone-state-field';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IMilestone;
  index: number;
  isSelected: boolean;
  onSelect?(): void;
  onAction?(): void;
}

interface ITableRowState {
}

export default class TableRow extends React.PureComponent<ITableRowProps, ITableRowState> {
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
      <div className={classNames('table-row-component', 'table-row', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        <div className="table-cell sid">
          <MilestoneSidField milestone={this.props.item} bold={this.props.isSelected} />
        </div>
        <div className="table-cell project">
          <MilestoneProjectField milestone={this.props.item} />
        </div>
        <div className="table-cell title">
          <MilestoneTitleField milestone={this.props.item} />
        </div>
        <div className="table-cell state">
          <MilestoneStateField milestone={this.props.item} />
        </div>
      </div>
    );
  }
};
