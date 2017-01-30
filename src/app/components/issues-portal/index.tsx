import * as _ from 'underscore';
import * as React from 'react';
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

interface IIssuesPortalProps {
}

interface IIssuesPortalState {
}

export default class IssuesPortal extends React.Component<IIssuesPortalProps, IIssuesPortalState> implements ICommandProvider, IIssueController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowManager = ServiceManager.Instance.getWindowManager();
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
      width: 800,
      modal: true,
    };

    this.windowManager.showWindow(this.addIssueWindow);
  }

  editIssue(issue: IIssue) {
    this.editIssueWindow = {
      content: <AddEditIssueWindow mode="edit" issue={issue} onUpdate={_.partial(this.handleEditIssueWindowUpdate, issue)} onCloseRequest={this.handleEditIssueWindowCloseRequest} />,
      width: 800,
      modal: true,
    };

    this.windowManager.showWindow(this.editIssueWindow);
  }

  deleteIssue(issue: IIssue) {
    this.deleteIssueWindow = {
      content: <DeleteIssueWindow issue={issue} onConfirm={_.partial(this.handleDeleteIssueWindowConfirm, issue)} onCloseRequest={this.handleDeleteIssueWindowCloseRequest} />,
      modal: true,
    };

    this.windowManager.showWindow(this.deleteIssueWindow);
  }

  private handleAddIssueWindowAdd(issue: IIssue) {
    this.actionManager.execute(new AddIssueAction(issue, this.application));
    this.windowManager.closeWindow(this.addIssueWindow);
  }

  private handleAddIssueWindowCloseRequest() {
    this.windowManager.closeWindow(this.addIssueWindow);
  }

  private handleEditIssueWindowUpdate(issue: IIssue, issueChange: IIssueChange) {
    this.actionManager.execute(new UpdateIssueAction(issue, issueChange, this.application));
    this.windowManager.closeWindow(this.editIssueWindow);
  }

  private handleEditIssueWindowCloseRequest() {
    this.windowManager.closeWindow(this.editIssueWindow);
  }

  private handleDeleteIssueWindowConfirm(issue: IIssue) {
    this.actionManager.execute(new DeleteIssueAction(issue, this.application));
    this.windowManager.closeWindow(this.deleteIssueWindow);
  }

  private handleDeleteIssueWindowCloseRequest() {
    this.windowManager.closeWindow(this.deleteIssueWindow);
  }

  render() {
    return (
      <div className="issues-portal component">
      </div>
    );
  }
};
