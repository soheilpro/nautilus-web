import * as React from 'react';
import { IIssue, IIssueChange } from '../../application';
import { ICommandProvider } from '../../commands';
import { IIssueController } from '../../issues';
import { ServiceManager } from '../../services';
import AddEditIssueWindow from '../add-edit-issue-window';
import DeleteIssueConfirmationWindow from '../delete-issue-confirmation-window';
import NewIssueCommand from './new-issue-command';
import AddIssueAction from './add-issue-action';
import UpdateIssueAction from './update-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssuesPortalProps {
}

interface IIssuesPortalState {
  isAddIssueWindowOpen?: boolean;
  isEditIssueWindowOpen?: boolean;
  editingIssue?: IIssue;
  isDeleteIssueConfirmationWindowOpen?: boolean;
  deletingIssue?: IIssue;
}

export default class IssuesPortal extends React.Component<IIssuesPortalProps, IIssuesPortalState> implements ICommandProvider, IIssueController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleNewIssueCommandExecute = this.handleNewIssueCommandExecute.bind(this);
    this.handleAddIssueWindowAdd = this.handleAddIssueWindowAdd.bind(this);
    this.handleAddIssueWindowCloseRequest = this.handleAddIssueWindowCloseRequest.bind(this);
    this.handleEditIssueWindowUpdate = this.handleEditIssueWindowUpdate.bind(this);
    this.handleEditIssueWindowCloseRequest = this.handleEditIssueWindowCloseRequest.bind(this);
    this.handleDeleteIssueConfirmationWindowConfirm = this.handleDeleteIssueConfirmationWindowConfirm.bind(this);
    this.handleDeleteIssueConfirmationWindowCloseRequest = this.handleDeleteIssueConfirmationWindowCloseRequest.bind(this);

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
      new NewIssueCommand(this.handleNewIssueCommandExecute),
    ];
  }

  addIssue() {
    this.setState({
      isAddIssueWindowOpen: true,
    });
  }

  editIssue(issue: IIssue) {
    this.setState({
      isEditIssueWindowOpen: true,
      editingIssue: issue,
    });
  }

  deleteIssue(issue: IIssue) {
    this.setState({
      isDeleteIssueConfirmationWindowOpen: true,
      deletingIssue: issue,
    });
  }

  private handleNewIssueCommandExecute() {
    this.setState({
      isAddIssueWindowOpen: true,
    });
  }

  private handleAddIssueWindowAdd(issue: IIssue) {
    this.actionManager.execute(new AddIssueAction(issue, this.application));

    this.setState({
      isAddIssueWindowOpen: false,
    });
  }

  private handleAddIssueWindowCloseRequest() {
    this.setState({
      isAddIssueWindowOpen: false,
    });
  }

  private handleEditIssueWindowUpdate(issueChange: IIssueChange) {
    this.actionManager.execute(new UpdateIssueAction(this.state.editingIssue, issueChange, this.application));

    this.setState({
      isEditIssueWindowOpen: false,
    });
  }

  private handleEditIssueWindowCloseRequest() {
    this.setState({
      isEditIssueWindowOpen: false,
    });
  }

  private handleDeleteIssueConfirmationWindowConfirm() {
    this.actionManager.execute(new DeleteIssueAction(this.state.deletingIssue, this.application));

    this.setState({
      isDeleteIssueConfirmationWindowOpen: false,
    });
  }

  private handleDeleteIssueConfirmationWindowCloseRequest() {
    this.setState({
      isDeleteIssueConfirmationWindowOpen: false,
    });
  }

  render() {
    return (
      <div className="issues-portal component">
        <AddEditIssueWindow mode="add" isOpen={this.state.isAddIssueWindowOpen} onAdd={this.handleAddIssueWindowAdd} onCloseRequest={this.handleAddIssueWindowCloseRequest} />
        <AddEditIssueWindow mode="edit" isOpen={this.state.isEditIssueWindowOpen} issue={this.state.editingIssue} onUpdate={this.handleEditIssueWindowUpdate} onCloseRequest={this.handleEditIssueWindowCloseRequest} />
        <DeleteIssueConfirmationWindow issue={this.state.deletingIssue} isOpen={this.state.isDeleteIssueConfirmationWindowOpen} onConfirm={this.handleDeleteIssueConfirmationWindowConfirm} onCloseRequest={this.handleDeleteIssueConfirmationWindowCloseRequest} />
      </div>
    );
  }
};
