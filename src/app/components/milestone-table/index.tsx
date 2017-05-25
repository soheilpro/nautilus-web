import * as React from 'react';
import * as classNames from 'classnames';
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
  className?: string;
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
      milestones: props.milestones,
      selectedMilestone: props.selectedMilestone,
    };
  }

  componentWillReceiveProps(props: IMilestoneTableProps) {
    this.setState({
      milestones: props.milestones,
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

  render() {
    return (
      <Table className={classNames('milestone-table-component', this.props.className)} items={this.state.milestones} selectedItem={this.state.selectedMilestone} Header={TableHeader} Row={TableRow} onItemSelect={this.handleTableItemSelect} onItemAction={this.handleTableItemAction} onItemDelete={this.handleTableItemDelete} />
    );
  }
};
