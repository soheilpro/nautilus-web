import * as React from 'react';
import { Nautilus, IMilestone, entityComparer } from '../nautilus';
import { MilestoneGrid } from './milestone-grid';

interface IMilestoneListProps {
  milestones?: IMilestone[];
  selectedMilestoneIndex?: number;
}

export class MilestoneList extends React.Component<IMilestoneListProps, {}> {
  handleSelectionChange(index: number): void {
    this.setState({
      selectedMilestoneIndex: index
    });
  }

  render() {
    var selectedMilestone = this.props.milestones[this.props.selectedMilestoneIndex];

    return (
      <MilestoneGrid milestones={this.props.milestones} selectedMilestoneIndex={this.props.selectedMilestoneIndex} onSelectionChange={this.handleSelectionChange.bind(this)} />
    );
  }
};
