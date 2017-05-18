import * as React from 'react';
import * as classNames from 'classnames';
import { IMilestone } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IMilestoneSelectProps {
  milestone: IMilestone;
  className?: string;
  onChange(milestone: IMilestone): void;
}

interface IMilestoneSelectState {
  milestones?: IMilestone[];
}

export default class MilestoneSelect extends React.PureComponent<IMilestoneSelectProps, IMilestoneSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      milestones: [],
    };
  }

  async componentDidMount() {
    this.setState({
      milestones: await this.application.items.getAllMilestones(null),
    });
  }

  private handleSelectChange(milestone: IMilestone) {
    this.props.onChange(milestone);
  }

  render() {
    return (
      <Select className={classNames('milestone-select-component', this.props.className)} selectedItem={this.props.milestone} items={this.state.milestones} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
