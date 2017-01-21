import * as React from 'react';
import * as classNames from 'classnames';
import { IIssue } from '../../application';
import { KeyCode } from '../../keyboard';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import DeleteIssueCommand from './delete-issue-command';

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
              <div className={classNames('issue', { selected: this.state.selectedIssueIndex === index })} tabIndex={0} onFocus={this.handleIssueFocus.bind(null, issue, index)} key={issue.id}>
                <span className="sid">{issue.sid}</span>
                <span className="title">{issue.title}</span>
              </div>
            );
          })
        }
      </div>
    );
  }
};
