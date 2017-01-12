import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import AddEditIssueModal from '../add-edit-issue-modal';
import NewIssueCommand from './new-issue-command';
import AddIssueAction from './add-issue-action';

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
    this.handleNewIssueCommandExecute = this.handleNewIssueCommandExecute.bind(this);
    this.handleAddEditIssueModalSave = this.handleAddEditIssueModalSave.bind(this);
    this.handleAddEditIssueModalCloseRequest = this.handleAddEditIssueModalCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.issueController.on('addIssue', this.handleIssueControllerAddIssue);
  }

  componentWillUnmount() {
    this.issueController.on('addIssue', this.handleIssueControllerAddIssue);
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

  private async handleIssueControllerAddIssue() {
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

  render() {
    return (
      <div className="issues-portal component">
        <AddEditIssueModal isOpen={this.state.isAddEditIssueModalOpen} onSave={this.handleAddEditIssueModalSave} onCloseRequest={this.handleAddEditIssueModalCloseRequest} />
      </div>
    );
  }
};
