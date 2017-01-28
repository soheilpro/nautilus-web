import * as React from 'react';
import { ITask } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Button from '../button';

interface IDeleteTaskWindowProps {
  task: ITask;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteTaskWindowState {
}

export default class DeleteTaskWindow extends React.Component<IDeleteTaskWindowProps, IDeleteTaskWindowState> {
  render() {
    return (
      <Window className="delete-task-window component">
        <WindowHeader>Delete Task</WindowHeader>
        <WindowContent>
          Are you sure you want to delete task #{this.props.task.sid}?
        </WindowContent>
        <WindowActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          <Button type="destructive" autoFocus={true} onClick={this.props.onConfirm}>Delete Task</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
