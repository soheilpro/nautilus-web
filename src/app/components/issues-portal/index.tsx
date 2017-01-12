import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import AddEditIssueModal from '../add-edit-issue-modal';
import NewIssueCommand from './new-issue-command';
import AddIssueAction from './add-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssuesPortalProps {
}

interface IIssuesPortalState {
  isAddEditIssueModalOpen?: boolean;
}

export default class IssuesPortal extends React.Component<IIssuesPortalProps, IIssuesPortalState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueController = ServiceManager.Instance.getIssueController();

  constructor() {
    super();

    this.handleIssueControllerAddIssue = this.handleIssueControllerAddIssue.bind(this);
    this.handleIssueControllerDeleteIssue = this.handleIssueControllerDeleteIssue.bind(this);
    this.handleNewIssueCommandExecute = this.handleNewIssueCommandExecute.bind(this);
    this.handleAddEditIssueModalSave = this.handleAddEditIssueModalSave.bind(this);
    this.handleAddEditIssueModalCloseRequest = this.handleAddEditIssueModalCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.issueController.on('addIssue', this.handleIssueControllerAddIssue);
    this.issueController.on('deleteIssue', this.handleIssueControllerDeleteIssue);
  }

  componentWillUnmount() {
    this.issueController.off('deleteIssue', this.handleIssueControllerDeleteIssue);
    this.issueController.off('addIssue', this.handleIssueControllerAddIssue);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new NewIssueCommand(this.handleNewIssueCommandExecute),
    ];
  }

  private handleNewIssueCommandExecute() {
    this.setState({
      isAddEditIssueModalOpen: true,
    });
  }

  private handleIssueControllerAddIssue() {
    this.setState({
      isAddEditIssueModalOpen: true,
    });
  }

  private handleIssueControllerDeleteIssue({ issue }: { issue: IIssue }) {
    this.actionManager.execute(new DeleteIssueAction(issue, this.application));

    this.setState({
      isAddEditIssueModalOpen: false,
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

  render() {
    return (
      <div className="issues-portal component">
        <AddEditIssueModal isOpen={this.state.isAddEditIssueModalOpen} onSave={this.handleAddEditIssueModalSave} onCloseRequest={this.handleAddEditIssueModalCloseRequest} />
      </div>
    );
  }
};
