import * as React from 'react';
import * as classNames from 'classnames';
import { IItemState } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface ITaskStateSelectProps {
  taskState: IItemState;
  className?: string;
  onChange(taskState: IItemState): void;
}

interface ITaskStateSelectState {
  taskStates?: IItemState[];
}

export default class TaskStateSelect extends React.Component<ITaskStateSelectProps, ITaskStateSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      taskStates: [],
    };
  }

  componentDidMount() {
    this.setState({
      taskStates: this.application.itemStates.getAllTaskStates(),
    });
  }

  private handleSelectChange(taskState: IItemState) {
    this.props.onChange(taskState);
  }

  render() {
    return (
      <Select className={classNames('task-state-select-component', this.props.className)} selectedItem={this.props.taskState} items={this.state.taskStates} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
