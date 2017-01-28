import * as React from 'react';
import { ICommandProvider } from '../../commands';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import IssueDetail from '../issue-detail';
import IssueList from '../issue-list';
import MasterPage from '../master-page';
import Button from '../button';
import Icon from '../icon';
import NewTaskCommand from './new-task-command';

require('./index.less');

interface IIssuesPageProps {
}

interface IIssuesPageState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueController = ServiceManager.Instance.getIssueController();
  private taskController = ServiceManager.Instance.getTaskController();

  constructor() {
    super();

    this.handleApplicationIssuesAdd = this.handleApplicationIssuesAdd.bind(this);
    this.handleApplicationIssuesUpdate = this.handleApplicationIssuesUpdate.bind(this);
    this.handleApplicationIssuesDelete = this.handleApplicationIssuesDelete.bind(this);
    this.handleNewIssueButtonClick = this.handleNewIssueButtonClick.bind(this);
    this.handleNewTaskButtonClick = this.handleNewTaskButtonClick.bind(this);
    this.handleRefreshButtonClick = this.handleRefreshButtonClick.bind(this);
    this.handleIssueListSelectedIssueChange = this.handleIssueListSelectedIssueChange.bind(this);

    this.state = {
      issues: []
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.application.issues.on('add', this.handleApplicationIssuesAdd);
    this.application.issues.on('update', this.handleApplicationIssuesUpdate);
    this.application.issues.on('delete', this.handleApplicationIssuesDelete);
  }

  async componentDidMount() {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  componentWillUnmount() {
    this.application.issues.off('delete', this.handleApplicationIssuesDelete);
    this.application.issues.off('update', this.handleApplicationIssuesUpdate);
    this.application.issues.off('add', this.handleApplicationIssuesAdd);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new NewTaskCommand(this.state.selectedIssue),
    ];
  }

  private async handleApplicationIssuesAdd({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  private async handleApplicationIssuesUpdate({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  private async handleApplicationIssuesDelete({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  private handleNewIssueButtonClick() {
    this.issueController.addIssue();
  }

  private handleNewTaskButtonClick() {
    this.taskController.addTask(this.state.selectedIssue);
  }

  private handleRefreshButtonClick() {
  }

  private handleIssueListSelectedIssueChange(issue: IIssue) {
    this.setState({
      selectedIssue: issue,
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="issues-page component">
          <div className="action-bar">
            <Button onClick={this.handleNewIssueButtonClick}><Icon name="plus" position="before" /> New Issue</Button>
            <Button onClick={this.handleNewTaskButtonClick}><Icon name="plus" position="before" /> New Task</Button>
            <Button type="secondary" onClick={this.handleRefreshButtonClick}><Icon name="refresh" /></Button>
          </div>
          <div className="row container">
            <div className="list">
              <IssueList issues={this.state.issues} onSelectedIssueChange={this.handleIssueListSelectedIssueChange} />
            </div>
            <div className="detail">
              {
                this.state.selectedIssue ?
                  <IssueDetail issue={this.state.selectedIssue} />
                  : null
              }
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
