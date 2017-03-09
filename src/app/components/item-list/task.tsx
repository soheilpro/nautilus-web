import * as React from 'react';
import { ITask } from '../../application';
import ItemSidField from '../item-sid-field';
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
          <ItemSidField sid={this.props.task.sid} />
        </span>
        <span className="arrow"></span>
        {
          this.props.task.type &&
            <span className="type"><ItemTypeField itemType={this.props.task.type} /></span>
        }
        <span className="title">{this.props.task.title}</span>
        {
          this.props.task.state &&
            <span className="state"><ItemStateField itemState={this.props.task.state} /></span>
        }
        {
          this.props.task.assignedTo &&
            <span className="assigned-to"><UserField user={this.props.task.assignedTo} /></span>
        }
      </div>
    );
  }
};
