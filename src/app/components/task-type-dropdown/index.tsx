import * as React from 'react';
import * as classNames from 'classnames';
import { ITaskType } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface ITaskTypeDropdownProps {
  taskType: ITaskType;
  className?: string;
  onChange(taskType: ITaskType): void;
}

interface ITaskTypeDropdownState {
  taskTypes?: ITaskType[];
}

export default class TaskTypeDropdown extends React.Component<ITaskTypeDropdownProps, ITaskTypeDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      taskTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      taskTypes: this.application.taskTypes.getAll(),
    });
  }

  private handleDropdownChange(taskType: ITaskType) {
    this.props.onChange(taskType);
  }

  render() {
    return (
      <Dropdown className={classNames('task-type-dropdown-component', this.props.className)} selectedItem={this.props.taskType} items={this.state.taskTypes} displayProperty="title" onChange={this.handleDropdownChange} />
    );
  }
};
