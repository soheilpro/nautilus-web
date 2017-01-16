import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { IIssueController } from '../../issues';
import { ServiceManager } from '../../services';
import AddEditIssueWindow from '../add-edit-issue-window';
import DeleteIssueConfirmationWindow from '../delete-issue-confirmation-window';
import NewIssueCommand from './new-issue-command';
import AddIssueAction from './add-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssuesPortalProps {
}

interface IIssuesPortalState {
  isAddEditIssueWindowOpen?: boolean;
  isDeleteIssueConfirmationWindowOpen?: boolean;
  issueToDelete?: IIssue;
}

export default class IssuesPortal extends React.Component<IIssuesPortalProps, IIssuesPortalState> implements ICommandProvider, IIssueController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleNewIssueCommandExecute = this.handleNewIssueCommandExecute.bind(this);
    this.handleAddEditIssueWindowSave = this.handleAddEditIssueWindowSave.bind(this);
    this.handleAddEditIssueWindowCloseRequest = this.handleAddEditIssueWindowCloseRequest.bind(this);
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
      isAddEditIssueWindowOpen: true,
    });
  }

  deleteIssue(issue: IIssue) {
    this.setState({
      isDeleteIssueConfirmationWindowOpen: true,
      issueToDelete: issue,
    });
  }

  private handleNewIssueCommandExecute() {
    this.setState({
      isAddEditIssueWindowOpen: true,
    });
  }

  private handleAddEditIssueWindowSave(issue: IIssue) {
    this.actionManager.execute(new AddIssueAction(issue, this.application));

    this.setState({
      isAddEditIssueWindowOpen: false,
    });
  }

  private handleAddEditIssueWindowCloseRequest() {
    this.setState({
      isAddEditIssueWindowOpen: false,
    });
  }

  private handleDeleteIssueConfirmationWindowConfirm() {
    this.actionManager.execute(new DeleteIssueAction(this.state.issueToDelete, this.application));

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
        <AddEditIssueWindow isOpen={this.state.isAddEditIssueWindowOpen} onSave={this.handleAddEditIssueWindowSave} onCloseRequest={this.handleAddEditIssueWindowCloseRequest} />
        <DeleteIssueConfirmationWindow issue={this.state.issueToDelete} isOpen={this.state.isDeleteIssueConfirmationWindowOpen} onConfirm={this.handleDeleteIssueConfirmationWindowConfirm} onCloseRequest={this.handleDeleteIssueConfirmationWindowCloseRequest} />
      </div>
    );
  }
};
