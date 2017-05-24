import * as _ from 'underscore';
import * as React from 'react';
import { IMilestone } from '../../application';
import { ServiceManager } from '../../services';
import Table from '../table';
import TableHeader from './table-header';
import TableRow from './table-row';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneTableProps {
  milestones?: IMilestone[];
  selectedMilestone?: IMilestone;
  onMilestoneSelect?(milestone: IMilestone): void;
}

interface IMilestoneTableState {
  milestones?: IMilestone[];
  selectedMilestone?: IMilestone;
}

export default class MilestoneTable extends React.PureComponent<IMilestoneTableProps, IMilestoneTableState> {
  private milestoneController = ServiceManager.Instance.getMilestoneController();

  constructor(props: IMilestoneTableProps) {
    super(props);

    this.handleTableItemSelect = this.handleTableItemSelect.bind(this);
    this.handleTableItemAction = this.handleTableItemAction.bind(this);
    this.handleTableItemDelete = this.handleTableItemDelete.bind(this);

    this.state = {
      milestones: this.sortMilestones(props.milestones),
      selectedMilestone: props.selectedMilestone,
    };
  }

  componentWillReceiveProps(props: IMilestoneTableProps) {
    this.setState({
      milestones: this.sortMilestones(props.milestones),
      selectedMilestone: props.selectedMilestone,
    });
  }

  private handleTableItemSelect(milestone: IMilestone) {
    if (this.props.onMilestoneSelect)
      this.props.onMilestoneSelect(milestone);

    this.setState({
      selectedMilestone: milestone,
    });
  }

  private handleTableItemAction(milestone: IMilestone) {
    return this.milestoneController.editMilestone(milestone);
  }

  private handleTableItemDelete(milestone: IMilestone) {
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
      <Table className="milestone-table-component" items={this.state.milestones} selectedItem={this.state.selectedMilestone} Header={TableHeader} Row={TableRow} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
};
