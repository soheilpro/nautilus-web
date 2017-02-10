import * as React from 'react';
import { ITaskState } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITaskStateFieldProps {
  taskState: ITaskState;
}

interface ITaskStateFieldState {
}

export default class TaskStateField extends React.Component<ITaskStateFieldProps, ITaskStateFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.taskState)
      return null;

    let taskState = this.application.taskStates.get(this.props.taskState);

    return (
      <div className="task-state-field-component">
        {taskState.title}
      </div>
    );
  }
};
