import * as React from 'react';
import { IItemType } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITaskTypeFieldProps {
  taskType: IItemType;
}

interface ITaskTypeFieldState {
}

export default class TaskTypeField extends React.Component<ITaskTypeFieldProps, ITaskTypeFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.taskType)
      return null;

    let taskType = this.application.itemTypes.get(this.props.taskType);

    return (
      <div className="task-type-field-component">
        {taskType.title}
      </div>
    );
  }
};
