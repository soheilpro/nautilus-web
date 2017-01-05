import * as React from 'react';
import { ICommand, ICommandProvider } from '../../commands';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import AddIssueAction from './add-issue-action';
import NewIssueCommand from './new-issue-command';
import IssueDetail from '../issue-detail';
import IssueList from '../issue-list';
import Master from '../master';

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

  async componentWillMount() {
    this.application.on('issues.add', this.handleApplicationIssuesAdd);
    this.application.on('issues.delete', this.handleApplicationIssuesDelete);
    this.commandManager.registerCommandProvider(this);

    this.setState({
      issues: await this.application.getIssues()
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    this.application.off('issues.delete', this.handleApplicationIssuesDelete);
    this.application.off('issues.add', this.handleApplicationIssuesAdd);
  }

  getCommands() {
    return [
      new NewIssueCommand(this.actionManager, this.application),
    ];
  }

  private async handleApplicationIssuesAdd(issue: IIssue) {
    this.setState({
      issues: await this.application.getIssues()
    });
  }

  private async handleApplicationIssuesDelete(issue: IIssue) {
    this.setState({
      issues: await this.application.getIssues()
    });
  }

  private handleNewIssueButtonClick() {
    let action = new AddIssueAction(this.application);
    this.actionManager.execute(action);
  }

  private handleNewTaskButtonClick() {
  }

  private handleRefreshButtonClick() {
  }

  private handleIssueListSelectedIssueChange(issue: IIssue) {
    this.setState({
      selectedIssue: issue
    });
  }

  render() {
    return (
      <Master>
        <div className="issues component">
          <div className="row action-bar">
            <button onClick={this.handleNewIssueButtonClick}><i className="fa fa-plus before" aria-hidden="true"></i> New Issue</button>
            <button onClick={this.handleNewTaskButtonClick}><i className="fa fa-plus before" aria-hidden="true"></i> New Task</button>
            <button className="secondary" onClick={this.handleRefreshButtonClick}><i className="fa fa-refresh before after" aria-hidden="true"></i></button>
          </div>
          <div className="row container">
            <div className="list pull-left">
              <IssueList issues={this.state.issues} onSelectedIssueChange={this.handleIssueListSelectedIssueChange} />
            </div>
            <div className="detail pull-right">
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
