import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import MilestoneSidField from '../milestone-sid-field';
import MilestoneTitleField from '../milestone-title-field';
import MilestoneProjectField from '../milestone-project-field';
import MilestoneStateField from '../milestone-state-field';
import { ITableRow } from '../table';

require('../../assets/stylesheets/base.less');
require('./table-row.less');

interface ITableRowProps {
  item: IMilestone;
  index: number;
  isSelected: boolean;
  onSelect?(item: IMilestone): void;
  onAction?(item: IMilestone): void;
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
      this.props.onSelect(this.props.item);
  }

  private handleDoubleClick() {
    if (this.props.onAction)
      this.props.onAction(this.props.item);
  }

  render() {
    return (
      <div className={classNames('table-row-component', 'table-row', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick} ref={e => this.componentElement = e}>
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
