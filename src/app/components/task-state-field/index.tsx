import * as React from 'react';
import { IItemState } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITaskStateFieldProps {
  taskState: IItemState;
}

interface ITaskStateFieldState {
}

export default class TaskStateField extends React.Component<ITaskStateFieldProps, ITaskStateFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.taskState)
      return null;

    let taskState = this.application.itemStates.get(this.props.taskState);

    return (
      <div className="task-state-field-component">
        {taskState.title}
      </div>
    );
  }
};
