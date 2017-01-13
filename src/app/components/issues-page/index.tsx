import * as React from 'react';
import { ICommandProvider, ICommand } from '../../commands';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import IssueDetail from '../issue-detail';
import IssueList from '../issue-list';
import MasterPage from '../master-page';
import Button from '../button';
import Icon from '../icon';

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
  private controllerManager = ServiceManager.Instance.getControllerManager();

  constructor() {
    super();

    this.handleApplicationIssuesAdd = this.handleApplicationIssuesAdd.bind(this);
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
    this.application.issues.on('delete', this.handleApplicationIssuesDelete);
  }

  async componentDidMount() {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  componentWillUnmount() {
    this.application.issues.off('delete', this.handleApplicationIssuesDelete);
    this.application.issues.off('add', this.handleApplicationIssuesAdd);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [] as ICommand[];
  }

  private async handleApplicationIssuesAdd(issue: IIssue) {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  private async handleApplicationIssuesDelete(issue: IIssue) {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  private handleNewIssueButtonClick() {
    this.controllerManager.getIssueController().addIssue();
  }

  private handleNewTaskButtonClick() {
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
