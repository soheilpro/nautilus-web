import * as React from 'react';
import { ITask } from '../../application';
import SidField from '../sid-field';
import TextField from '../text-field';
import ItemTypeField from '../item-type-field';
import ItemStateField from '../item-state-field';
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
        <span className="sid">
          <SidField sid={this.props.task.sid} />
        </span>
        <span className="arrow"></span>
        {
          this.props.task.type &&
            <span className="type">
              <ItemTypeField itemType={this.props.task.type} />
            </span>
        }
        {
          this.props.task.title &&
            <span className="title">
              <TextField title={this.props.task.title} />
            </span>
        }
        {
          this.props.task.state &&
            <span className="state">
              <ItemStateField itemState={this.props.task.state} />
            </span>
        }
        {
          this.props.task.assignedTo &&
            <span className="assigned-to">
              <UserField user={this.props.task.assignedTo} />
            </span>
        }
      </div>
    );
  }
};
