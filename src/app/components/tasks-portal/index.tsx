import * as React from 'react';
import * as _ from 'underscore';
import { ITask, ITaskChange, IIssue } from '../../application';
import { ICommandProvider, ICommand } from '../../commands';
import { ITaskController } from '../../tasks';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import AddEditTaskWindow from '../add-edit-task-window';
import DeleteTaskWindow from '../delete-task-window';
import AddTaskAction from './add-task-action';
import UpdateTaskAction from './update-task-action';
import DeleteTaskAction from './delete-task-action';

interface ITasksPortalProps {
}

interface ITasksPortalState {
}

export default class TasksPortal extends React.Component<ITasksPortalProps, ITasksPortalState> implements ICommandProvider, ITaskController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowManager = ServiceManager.Instance.getWindowManager();
  private addTaskWindow: IWindow;
  private editTaskWindow: IWindow;
  private deleteTaskWindow: IWindow;

  constructor() {
    super();

    this.handleAddTaskWindowAdd = this.handleAddTaskWindowAdd.bind(this);
    this.handleAddTaskWindowCloseRequest = this.handleAddTaskWindowCloseRequest.bind(this);
    this.handleEditTaskWindowUpdate = this.handleEditTaskWindowUpdate.bind(this);
    this.handleEditTaskWindowCloseRequest = this.handleEditTaskWindowCloseRequest.bind(this);
    this.handleDeleteTaskWindowConfirm = this.handleDeleteTaskWindowConfirm.bind(this);
    this.handleDeleteTaskWindowCloseRequest = this.handleDeleteTaskWindowCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setTaskController(this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setTaskController(undefined);
  }

  getCommands() {
    return [] as ICommand[];
  }

  addTask(issue: IIssue) {
    this.addTaskWindow = {
      content: <AddEditTaskWindow mode="add" onAdd={_.partial(this.handleAddTaskWindowAdd, issue)} onCloseRequest={this.handleAddTaskWindowCloseRequest} />,
      width: 800,
      isModal: true,
    };

    this.windowManager.showWindow(this.addTaskWindow);
  }

  editTask(task: ITask) {
    this.editTaskWindow = {
      content: <AddEditTaskWindow mode="edit" task={task} onUpdate={_.partial(this.handleEditTaskWindowUpdate, task)} onCloseRequest={this.handleEditTaskWindowCloseRequest} />,
      width: 800,
      isModal: true,
    };

    this.windowManager.showWindow(this.editTaskWindow);
  }

  deleteTask(task: ITask) {
    this.deleteTaskWindow = {
      content: <DeleteTaskWindow task={task} onConfirm={_.partial(this.handleDeleteTaskWindowConfirm, task)} onCloseRequest={this.handleDeleteTaskWindowCloseRequest} />,
      isModal: true,
    };

    this.windowManager.showWindow(this.deleteTaskWindow);
  }

  private handleAddTaskWindowAdd(issue: IIssue, task: ITask) {
    this.actionManager.execute(new AddTaskAction(task, issue, this.application));
    this.windowManager.closeWindow(this.addTaskWindow);
  }

  private handleAddTaskWindowCloseRequest() {
    this.windowManager.closeWindow(this.addTaskWindow);
  }

  private handleEditTaskWindowUpdate(task: ITask, taskChange: ITaskChange) {
    this.actionManager.execute(new UpdateTaskAction(task, taskChange, this.application));
    this.windowManager.closeWindow(this.editTaskWindow);
  }

  private handleEditTaskWindowCloseRequest() {
    this.windowManager.closeWindow(this.editTaskWindow);
  }

  private handleDeleteTaskWindowConfirm(task: ITask) {
    this.actionManager.execute(new DeleteTaskAction(task, this.application));
    this.windowManager.closeWindow(this.deleteTaskWindow);
  }

  private handleDeleteTaskWindowCloseRequest() {
    this.windowManager.closeWindow(this.deleteTaskWindow);
  }

  render() {
    return (
      <div className="tasks-portal component">
      </div>
    );
  }
};
