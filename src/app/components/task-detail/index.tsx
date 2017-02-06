import * as React from 'react';
import { ITask } from '../../application';

require('./index.less');

interface ITaskDetailProps {
  task: ITask;
}

interface ITaskDetailState {
}

export default class TaskDetail extends React.Component<ITaskDetailProps, ITaskDetailState> {
  render() {
    return (
      <div className="task-detail component">
        <div className="header">Task #{this.props.task.sid}</div>
      </div>
    );
  }
};
