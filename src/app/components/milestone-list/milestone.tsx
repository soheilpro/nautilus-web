import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import MilestoneSidField from '../milestone-sid-field';
import MilestoneTitleField from '../milestone-title-field';
import MilestoneProjectField from '../milestone-project-field';
import MilestoneStateField from '../milestone-state-field';

require('../../assets/stylesheets/base.less');
require('./milestone.less');

interface IMilestoneProps {
  item: IMilestone;
  index: number;
  isSelected: boolean;
  onSelect?(): void;
  onAction?(): void;
}

interface IMilestoneState {
}

export default class Milestone extends React.PureComponent<IMilestoneProps, IMilestoneState> {
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
      <div className={classNames('milestone-component', 'list-item', { 'selected': this.props.isSelected })} tabIndex={0} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        <div className="list-item-field sid">
          <MilestoneSidField milestone={this.props.item} bold={this.props.isSelected} />
        </div>
        <div className="list-item-field project">
          <MilestoneProjectField milestone={this.props.item} />
        </div>
        <div className="list-item-field title">
          <MilestoneTitleField milestone={this.props.item} />
        </div>
        <div className="list-item-field state">
          <MilestoneStateField milestone={this.props.item} />
        </div>
      </div>
    );
  }
};
