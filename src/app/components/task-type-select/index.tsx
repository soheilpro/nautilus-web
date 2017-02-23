import * as React from 'react';
import * as classNames from 'classnames';
import { IItemType } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface ITaskTypeSelectProps {
  taskType: IItemType;
  className?: string;
  onChange(taskType: IItemType): void;
}

interface ITaskTypeSelectState {
  taskTypes?: IItemType[];
}

export default class TaskTypeSelect extends React.Component<ITaskTypeSelectProps, ITaskTypeSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      taskTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      taskTypes: this.application.itemTypes.getAllTaskTypes(),
    });
  }

  private handleSelectChange(taskType: IItemType) {
    this.props.onChange(taskType);
  }

  render() {
    return (
      <Select className={classNames('task-type-select-component', this.props.className)} selectedItem={this.props.taskType} items={this.state.taskTypes} displayProperty="title" onChange={this.handleSelectChange} />
    );
  }
};
