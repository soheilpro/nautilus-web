import * as React from 'react';
import * as classNames from 'classnames';
import { ITaskState } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface ITaskStateDropdownProps {
  taskState: ITaskState;
  className?: string;
  onChange(taskState: ITaskState): void;
}

interface ITaskStateDropdownState {
  taskStates?: ITaskState[];
}

export default class TaskStateDropdown extends React.Component<ITaskStateDropdownProps, ITaskStateDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      taskStates: [],
    };
  }

  componentDidMount() {
    this.setState({
      taskStates: this.application.taskStates.getAll(),
    });
  }

  private handleDropdownChange(taskState: ITaskState) {
    this.props.onChange(taskState);
  }

  render() {
    return (
      <Dropdown className={classNames('task-state-dropdown-component', this.props.className)} selectedItem={this.props.taskState} items={this.state.taskStates} displayProperty="title" onChange={this.handleDropdownChange} />
    );
  }
};
