import * as React from 'react';
import { ICommand, ICommandProvider } from '../../commands';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import IssueDetail from '../issue-detail';
import IssueList from '../issue-list';
import Master from '../master';
import Button from '../button';

require('./index.less');

interface IIssuesProps {
}

interface IIssuesState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class Issues extends React.Component<IIssuesProps, IIssuesState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();

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
    this.application.issues.on('add', this.handleApplicationIssuesAdd);
    this.application.issues.on('delete', this.handleApplicationIssuesDelete);
    this.commandManager.registerCommandProvider(this);
  }

  async componentDidMount() {
    this.setState({
      issues: await this.application.issues.getAll(),
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    this.application.issues.off('delete', this.handleApplicationIssuesDelete);
    this.application.issues.off('add', this.handleApplicationIssuesAdd);
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
    this.commandManager.getCommand('new-issue').execute();
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
      <Master>
        <div className="issues component">
          <div className="action-bar">
            <Button onClick={this.handleNewIssueButtonClick}><i className="fa fa-plus before" aria-hidden="true"></i> New Issue</Button>
            <Button onClick={this.handleNewTaskButtonClick}><i className="fa fa-plus before" aria-hidden="true"></i> New Task</Button>
            <Button type="secondary" onClick={this.handleRefreshButtonClick}><i className="fa fa-refresh before after" aria-hidden="true"></i></Button>
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
      </Master>
    );
  }
};
