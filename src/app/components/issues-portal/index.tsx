import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { IIssueController } from '../../issues';
import { ServiceManager } from '../../services';
import AddEditIssueModal from '../add-edit-issue-modal';
import DeleteIssueConfirmationModal from '../delete-issue-confirmation-modal';
import NewIssueCommand from './new-issue-command';
import AddIssueAction from './add-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssuesPortalProps {
}

interface IIssuesPortalState {
  isAddEditIssueModalOpen?: boolean;
  isDeleteIssueConfirmationModalOpen?: boolean;
  issueToDelete?: IIssue;
}

export default class IssuesPortal extends React.Component<IIssuesPortalProps, IIssuesPortalState> implements ICommandProvider, IIssueController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleNewIssueCommandExecute = this.handleNewIssueCommandExecute.bind(this);
    this.handleAddEditIssueModalSave = this.handleAddEditIssueModalSave.bind(this);
    this.handleAddEditIssueModalCloseRequest = this.handleAddEditIssueModalCloseRequest.bind(this);
    this.handleDeleteIssueConfirmationModalConfirm = this.handleDeleteIssueConfirmationModalConfirm.bind(this);
    this.handleDeleteIssueConfirmationModalCloseRequest = this.handleDeleteIssueConfirmationModalCloseRequest.bind(this);

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
      isAddEditIssueModalOpen: true,
    });
  }

  deleteIssue(issue: IIssue) {
    this.setState({
      isDeleteIssueConfirmationModalOpen: true,
      issueToDelete: issue,
    });
  }

  private handleNewIssueCommandExecute() {
    this.setState({
      isAddEditIssueModalOpen: true,
    });
  }

  private handleAddEditIssueModalSave(issue: IIssue) {
    this.actionManager.execute(new AddIssueAction(issue, this.application));

    this.setState({
      isAddEditIssueModalOpen: false,
    });
  }

  private handleAddEditIssueModalCloseRequest() {
    this.setState({
      isAddEditIssueModalOpen: false,
    });
  }

  private handleDeleteIssueConfirmationModalConfirm() {
    this.actionManager.execute(new DeleteIssueAction(this.state.issueToDelete, this.application));

    this.setState({
      isDeleteIssueConfirmationModalOpen: false,
    });
  }

  private handleDeleteIssueConfirmationModalCloseRequest() {
    this.setState({
      isDeleteIssueConfirmationModalOpen: false,
    });
  }

  render() {
    return (
      <div className="issues-portal component">
        <AddEditIssueModal isOpen={this.state.isAddEditIssueModalOpen} onSave={this.handleAddEditIssueModalSave} onCloseRequest={this.handleAddEditIssueModalCloseRequest} />
        <DeleteIssueConfirmationModal issue={this.state.issueToDelete} isOpen={this.state.isDeleteIssueConfirmationModalOpen} onConfirm={this.handleDeleteIssueConfirmationModalConfirm} onCloseRequest={this.handleDeleteIssueConfirmationModalCloseRequest} />
      </div>
    );
  }
};
