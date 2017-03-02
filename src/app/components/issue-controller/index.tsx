import _ from 'underscore';
import React from 'react';
import { IIssue, IIssueChange } from '../../application';
import { ICommandProvider } from '../../commands';
import { IIssueController } from '../../issues';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import AddEditIssueWindow from '../add-edit-issue-window';
import DeleteIssueWindow from '../delete-issue-window';
import NewIssueCommand from './new-issue-command';
import AddIssueAction from './add-issue-action';
import UpdateIssueAction from './update-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssueControllerProps {
}

interface IIssueControllerState {
}

export default class IssueController extends React.Component<IIssueControllerProps, IIssueControllerState> implements IIssueController, ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private addIssueWindow: IWindow;
  private editIssueWindow: IWindow;
  private deleteIssueWindow: IWindow;

  constructor() {
    super();

    this.handleAddIssueWindowAdd = this.handleAddIssueWindowAdd.bind(this);
    this.handleAddIssueWindowCloseRequest = this.handleAddIssueWindowCloseRequest.bind(this);
    this.handleEditIssueWindowUpdate = this.handleEditIssueWindowUpdate.bind(this);
    this.handleEditIssueWindowCloseRequest = this.handleEditIssueWindowCloseRequest.bind(this);
    this.handleDeleteIssueWindowConfirm = this.handleDeleteIssueWindowConfirm.bind(this);
    this.handleDeleteIssueWindowCloseRequest = this.handleDeleteIssueWindowCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setIssueController(this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setIssueController(undefined);
  }

  getCommands() {
    return [
      new NewIssueCommand(),
    ];
  }

  addIssue() {
    this.addIssueWindow = {
      content: <AddEditIssueWindow mode="add" onAdd={this.handleAddIssueWindowAdd} onCloseRequest={this.handleAddIssueWindowCloseRequest} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.addIssueWindow);
  }

  editIssue(issue: IIssue) {
    this.editIssueWindow = {
      content: <AddEditIssueWindow mode="edit" issue={issue} onUpdate={_.partial(this.handleEditIssueWindowUpdate, issue)} onCloseRequest={this.handleEditIssueWindowCloseRequest} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.editIssueWindow);
  }

  deleteIssue(issue: IIssue) {
    this.deleteIssueWindow = {
      content: <DeleteIssueWindow issue={issue} onConfirm={_.partial(this.handleDeleteIssueWindowConfirm, issue)} onCloseRequest={this.handleDeleteIssueWindowCloseRequest} />,
      top: 120,
      width: 600,
      modal: true,
    };

    this.windowController.showWindow(this.deleteIssueWindow);
  }

  private handleAddIssueWindowAdd(issue: IIssue) {
    this.actionManager.execute(new AddIssueAction(issue, this.application));
    this.windowController.closeWindow(this.addIssueWindow);
  }

  private handleAddIssueWindowCloseRequest() {
    this.windowController.closeWindow(this.addIssueWindow);
  }

  private handleEditIssueWindowUpdate(issue: IIssue, issueChange: IIssueChange) {
    this.actionManager.execute(new UpdateIssueAction(issue, issueChange, this.application));
    this.windowController.closeWindow(this.editIssueWindow);
  }

  private handleEditIssueWindowCloseRequest() {
    this.windowController.closeWindow(this.editIssueWindow);
  }

  private handleDeleteIssueWindowConfirm(issue: IIssue) {
    this.actionManager.execute(new DeleteIssueAction(issue, this.application));
    this.windowController.closeWindow(this.deleteIssueWindow);
  }

  private handleDeleteIssueWindowCloseRequest() {
    this.windowController.closeWindow(this.deleteIssueWindow);
  }

  render() {
    return (
      <div className="issue-controller-component">
      </div>
    );
  }
};
