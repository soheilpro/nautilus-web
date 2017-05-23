import * as _ from 'underscore';
import * as React from 'react';
import { IMilestone } from '../../application';
import { ServiceManager } from '../../services';
import List from '../list';
import Milestone from './milestone';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneListProps {
  milestones?: IMilestone[];
  selectedMilestone?: IMilestone;
  onMilestoneSelect?(milestone: IMilestone): void;
}

interface IMilestoneListState {
  milestones?: IMilestone[];
  selectedMilestone?: IMilestone;
}

export default class MilestoneList extends React.PureComponent<IMilestoneListProps, IMilestoneListState> {
  private milestoneController = ServiceManager.Instance.getMilestoneController();

  constructor(props: IMilestoneListProps) {
    super(props);

    this.handleListItemSelect = this.handleListItemSelect.bind(this);
    this.handleListItemAction = this.handleListItemAction.bind(this);
    this.handleListItemDelete = this.handleListItemDelete.bind(this);

    this.state = {
      milestones: this.sortMilestones(props.milestones),
      selectedMilestone: props.selectedMilestone,
    };
  }

  componentWillReceiveProps(props: IMilestoneListProps) {
    this.setState({
      milestones: this.sortMilestones(props.milestones),
      selectedMilestone: props.selectedMilestone,
    });
  }

  private handleListItemSelect(milestone: IMilestone) {
    if (this.props.onMilestoneSelect)
      this.props.onMilestoneSelect(milestone);

    this.setState({
      selectedMilestone: milestone,
    });
  }

  private handleListItemAction(milestone: IMilestone) {
    return this.milestoneController.editMilestone(milestone);
  }

  private handleListItemDelete(milestone: IMilestone) {
    return this.milestoneController.deleteMilestone(milestone);
  }

  private sortMilestones(milestones: IMilestone[]) {
    const findMilestoneById = _.memoize((id: string) => {
      return _.find(milestones, milestone => milestone.id === id);
    });

    const getParents = (milestone: IMilestone): IMilestone[] => {
      if (!milestone.parent)
        return [];

      const parent = findMilestoneById(milestone.parent.id);

      if (!parent)
        return [];

      return getParents(parent).concat(parent);
    };

    const milestonesWithPath = milestones.map(milestone => {
      return {
        milestone,
        path: getParents(milestone).concat(milestone).map(milestone => milestone.sid),
      };
    });

    milestonesWithPath.sort((x, y) => {
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

    return milestonesWithPath.map(milestoneWithPath => milestoneWithPath.milestone);
  }

  render() {
    return (
      <List className="milestone-list-component" items={this.state.milestones} selectedItem={this.state.selectedMilestone} Item={Milestone} onItemSelect={this.handleListItemSelect} onItemAction={this.handleListItemAction} onItemDelete={this.handleListItemDelete} />
    );
  }
};
