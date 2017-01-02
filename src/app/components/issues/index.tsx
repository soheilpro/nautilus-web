import * as React from 'react';
import { Command, ICommand, ICommandProvider } from '../../commands';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
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
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleSelectedIssueChange = this.handleSelectedIssueChange.bind(this);

    this.state = {
      issues: []
    };
  }

  async componentWillMount() {
    this.commandManager.registerCommandProvider(this);

    this.setState({
      issues: await this.application.getIssues()
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new Command({
        id: 'new-issue',
        name: 'New Issue',
        shortcuts: [[{ keyCode: KeyCode.N }]],
        onExecute: () => { alert('new issue'); },
      }),
      new Command({
        id: 'new-task',
        name: 'New Task',
        shortcuts: [[{ keyCode: KeyCode.T }]],
        onExecute: () => { alert('new task'); },
      }),
      new Command({
        id: 'refresh',
        name: 'Refresh',
        shortcuts: [[{ keyCode: KeyCode.R }]],
        onExecute: () => { alert('refresh'); },
      }),
    ];
  }

  private handleSelectedIssueChange(issue: IIssue) {
    this.setState({
      selectedIssue: issue
    });
  }

  render() {
    return (
      <Master>
        <div className="issues component">
          <div className="row action-bar">
            <button><i className="fa fa-plus before" aria-hidden="true"></i> New Issue</button>
            <button><i className="fa fa-plus before" aria-hidden="true"></i> New Task</button>
            <button className="secondary"><i className="fa fa-refresh before after" aria-hidden="true"></i></button>
          </div>
          <div className="row container">
            <div className="list pull-left">
              <IssueList issues={this.state.issues} onSelectedIssueChange={this.handleSelectedIssueChange} />
            </div>
            <div className="detail pull-right">
              {
                this.state.selectedIssue ?
                  <IssueDetail issue={this.state.selectedIssue} /> :
                  null
              }
            </div>
          </div>
        </div>
      </Master>
    );
  }
};
