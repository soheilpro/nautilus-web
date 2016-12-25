import * as React from 'react';
import { IIssue } from '../../application';
import ServiceManager from '../../service-manager';
import { Command, ICommandProvider, ICommand } from '../../controller';
import { KeyCode } from '../../keyboard';
import Master from '../master';
import IssueList from '../issue-list';
import IssueDetail from '../issue-detail';

require('./index.less');

interface IIssuesState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class Issues extends React.Component<{}, IIssuesState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private controller = ServiceManager.Instance.getController();

  constructor() {
    super();

    this.handleSelectedIssueChange = this.handleSelectedIssueChange.bind(this);

    this.state = {
      issues: []
    };
  }

  async componentWillMount() {
    this.controller.registerCommandProvider(this);

    this.setState({
      issues: await this.application.getIssues()
    });
  }

  componentWillUnmount() {
    this.controller.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new Command({
        id: 'new-issue',
        name: 'New Issue',
        shortcut: { keyCombinations: [{ which: KeyCode.N }], },
        doAction: () => { console.log('new issue'); },
      }),
      new Command({
        id: 'new-task',
        name: 'New Task',
        shortcut: { keyCombinations: [{ which: KeyCode.T }], },
        doAction: () => { console.log('new task'); },
      }),
      new Command({
        id: 'refresh',
        name: 'Refresh',
        shortcut: { keyCombinations: [{ which: KeyCode.R }], },
        doAction: () => { console.log('refresh'); },
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
            <button title="Shortcut: N"><i className="fa fa-plus before" aria-hidden="true"></i> New Issue</button>
            <button title="Shortcut: T"><i className="fa fa-plus before" aria-hidden="true"></i> New Task</button>
            <button title="Shortcut: R" className="secondary"><i className="fa fa-refresh before after" aria-hidden="true"></i></button>
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
