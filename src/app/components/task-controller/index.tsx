import * as _ from 'underscore';
import * as React from 'react';
import { ITask, ITaskChange, IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ITaskController } from '../../tasks';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import AddEditTaskWindow from '../add-edit-task-window';
import DeleteTaskWindow from '../delete-task-window';
import NewTaskCommand from './new-task-command';
import EditTaskCommand from './edit-task-command';
import DeleteTaskCommand from './delete-task-command';
import AddTaskAction from './add-task-action';
import UpdateTaskAction from './update-task-action';
import DeleteTaskAction from './delete-task-action';

interface ITaskControllerProps {
}

interface ITaskControllerState {
}

export default class TaskController extends React.Component<ITaskControllerProps, ITaskControllerState> implements ITaskController, ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private contextManager = ServiceManager.Instance.getContextManager();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
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
    const context = this.contextManager.getContext();
    const activeIssue = context['activeIssue'];
    const activeTask = context['activeTask'];

    return [
      new NewTaskCommand(activeIssue),
      new EditTaskCommand(activeTask),
      new DeleteTaskCommand(activeTask),
    ];
  }

  addTask(issue: IIssue) {
    this.addTaskWindow = {
      content: <AddEditTaskWindow mode="add" onAdd={_.partial(this.handleAddTaskWindowAdd, issue)} onCloseRequest={this.handleAddTaskWindowCloseRequest} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.addTaskWindow);
  }

  editTask(task: ITask) {
    this.editTaskWindow = {
      content: <AddEditTaskWindow mode="edit" task={task} onUpdate={_.partial(this.handleEditTaskWindowUpdate, task)} onCloseRequest={this.handleEditTaskWindowCloseRequest} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.editTaskWindow);
  }

  deleteTask(task: ITask) {
    this.deleteTaskWindow = {
      content: <DeleteTaskWindow task={task} onConfirm={_.partial(this.handleDeleteTaskWindowConfirm, task)} onCloseRequest={this.handleDeleteTaskWindowCloseRequest} />,
      top: 120,
      width: 600,
      modal: true,
    };

    this.windowController.showWindow(this.deleteTaskWindow);
  }

  private handleAddTaskWindowAdd(issue: IIssue, task: ITask) {
    this.actionManager.execute(new AddTaskAction(task, issue, this.application));
    this.windowController.closeWindow(this.addTaskWindow);
  }

  private handleAddTaskWindowCloseRequest() {
    this.windowController.closeWindow(this.addTaskWindow);
  }

  private handleEditTaskWindowUpdate(task: ITask, taskChange: ITaskChange) {
    this.actionManager.execute(new UpdateTaskAction(task, taskChange, this.application));
    this.windowController.closeWindow(this.editTaskWindow);
  }

  private handleEditTaskWindowCloseRequest() {
    this.windowController.closeWindow(this.editTaskWindow);
  }

  private handleDeleteTaskWindowConfirm(task: ITask) {
    this.actionManager.execute(new DeleteTaskAction(task, this.application));
    this.windowController.closeWindow(this.deleteTaskWindow);
  }

  private handleDeleteTaskWindowCloseRequest() {
    this.windowController.closeWindow(this.deleteTaskWindow);
  }

  render() {
    return (
      <div className="task-controller-component">
      </div>
    );
  }
};
