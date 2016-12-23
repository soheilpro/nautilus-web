import * as React from 'react';
import { IIssue } from '../../application';
import ServiceManager from '../../service-manager';
import Master from '../master';
import IssueList from '../issue-list';
import IssueDetail from '../issue-detail';

require('./index.less');

interface IIssuesState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
}

export default class Issues extends React.Component<{}, IIssuesState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectedIssueChange = this.handleSelectedIssueChange.bind(this);

    this.state = {
      issues: []
    };
  }

  async componentWillMount() {
    this.setState({
      issues: await this.application.getIssues()
    });
  }

  componentWillUnmount() {
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
