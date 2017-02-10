import * as React from 'react';
import { ITask } from '../../application';
import TaskTypeField from '../task-type-field';
import TaskStateField from '../task-state-field';
import UserField from '../user-field';

require('../../assets/stylesheets/base.less');
require('./task.less');

interface ITaskProps {
  task: ITask;
}

interface ITaskState {
}

export default class Task extends React.Component<ITaskProps, ITaskState> {
  render() {
    return (
      <div className="task-component">
        <span className="sid">{this.props.task.sid}</span>
        <span className="arrow"></span>
        {
          this.props.task.type ?
            <span className="type"><TaskTypeField taskType={this.props.task.type} /></span>
            : null
        }
        <span className="title">{this.props.task.title}</span>
        {
          this.props.task.state ?
            <span className="state"><TaskStateField taskState={this.props.task.state} /></span>
            : null
        }
        {
          this.props.task.assignedTo ?
            <span className="assigned-to"><UserField user={this.props.task.assignedTo} /></span>
            : null
        }
      </div>
    );
  }
};
