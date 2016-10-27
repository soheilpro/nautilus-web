import * as React from 'react';
import { Nautilus, ITask } from '../nautilus';
import { DescriptionTaskField } from './task-field-description';
import { CreatedByTaskField } from './task-field-created-by';

interface TaskDetailProps {
  task: ITask;
}

export class TaskDetail extends React.Component<TaskDetailProps, {}> {
  render() {
    return (
      <div className='task-detail'>
        <div className='header'>Task #{this.props.task.sid}</div>
        <DescriptionTaskField task={this.props.task} />
        <br />

        <strong>Created By:</strong>
        <CreatedByTaskField task={this.props.task} />
      </div>
    );
  }
};
