import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import EditIssueCommand from './edit-issue-command';
import DeleteIssueCommand from './delete-issue-command';
import ProjectField from '../project-field';
import IssueTypeField from '../issue-type-field';
import IssuePriorityField from '../issue-priority-field';
import IssueStateField from '../issue-state-field';

require('./index.less');

interface IIssueListProps {
  issues?: IIssue[];
  onSelectedIssueChange?(issue: IIssue): void;
}

interface IIssueListState {
  isFocused?: boolean;
  selectedIssueIndex?: number;
}

export default class IssueList extends React.Component<IIssueListProps, IIssueListState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueController = ServiceManager.Instance.getIssueController();

  constructor() {
    super();

    this.handleIssueFocus = this.handleIssueFocus.bind(this);
    this.handleIssueDoubleClick = this.handleIssueDoubleClick.bind(this);
    this.handleIssueListKeyDown = this.handleIssueListKeyDown.bind(this);
    this.handleIssueListBlur = this.handleIssueListBlur.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    let selectedIssue = this.props.issues[this.state.selectedIssueIndex];

    return [
      selectedIssue ? new EditIssueCommand(selectedIssue, this.issueController) : undefined,
      selectedIssue ? new DeleteIssueCommand(selectedIssue, this.issueController) : undefined,
    ];
  }

  private handleIssueFocus(issue: IIssue, index: number) {
    if (this.props.onSelectedIssueChange)
      this.props.onSelectedIssueChange(issue);

    this.setState({
      isFocused: true,
      selectedIssueIndex: index,
    });
  }

  private handleIssueDoubleClick(issue: IIssue, index: number) {
    this.issueController.editIssue(issue);
  }

  private handleIssueListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedIssueIndex < this.props.issues.length - 1) {
        let selectedIssueIndex = this.state.selectedIssueIndex + 1;

        this.setState({
          selectedIssueIndex: selectedIssueIndex,
        });

        this.props.onSelectedIssueChange(this.props.issues[selectedIssueIndex]);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedIssueIndex > 0) {
        let selectedIssueIndex = this.state.selectedIssueIndex - 1;

        this.setState({
          selectedIssueIndex: selectedIssueIndex,
        });

        this.props.onSelectedIssueChange(this.props.issues[selectedIssueIndex]);
      }
    }
  }

  private handleIssueListBlur() {
    this.setState({
      isFocused: false,
    });
  }

  render() {
    return (
      <div className={classNames('issue-list component', { focused: this.state.isFocused })} onKeyDown={this.handleIssueListKeyDown} onBlur={this.handleIssueListBlur}>
        {
          this.props.issues.map((issue, index) => {
            return (
              <div className={classNames('issue', { selected: this.state.selectedIssueIndex === index })} tabIndex={0} onFocus={this.handleIssueFocus.bind(null, issue, index)} onDoubleClick={this.handleIssueDoubleClick.bind(null, issue, index)} key={issue.id}>
                <span className="sid">{issue.sid}</span>
                <span className="title">{issue.title}</span>
                {
                  issue.project ?
                    <span className="project"><ProjectField project={issue.project} /></span>
                    : null
                }
                {
                  issue.type ?
                    <span className="type"><IssueTypeField issueType={issue.type} /></span>
                    : null
                }
                {
                  issue.priority ?
                    <span className="priority"><IssuePriorityField issuePriority={issue.priority} /></span>
                    : null
                }
                {
                  issue.state ?
                    <span className="state"><IssueStateField issueState={issue.state} /></span>
                    : null
                }
              </div>
            );
          })
        }
      </div>
    );
  }
};
