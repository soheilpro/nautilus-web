import * as React from 'react';
import * as classNames from 'classnames';
import { ITaskState } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface ITaskStateSelectProps {
  taskState: ITaskState;
  className?: string;
  onChange(taskState: ITaskState): void;
}

interface ITaskStateSelectState {
  taskStates?: ITaskState[];
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
      taskStates: this.application.taskStates.getAll(),
    });
  }

  private handleSelectChange(taskState: ITaskState) {
    this.props.onChange(taskState);
  }

  render() {
    return (
      <Select className={classNames('task-state-select-component', this.props.className)} selectedItem={this.props.taskState} items={this.state.taskStates} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
