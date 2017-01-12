import * as React from 'react';
import { IIssue } from '../../application';
import { ICommand, ICommandProvider } from '../../commands';
import { KeyCode, KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
import AddIssueAction from './add-issue-action';
import NewIssueCommand from './new-issue-command';
import ViewCommandsCommand from './view-commands-command';
import SearchCommand from './search-command';
import UndoCommand from './undo-command';
import ViewIssuesCommand from './view-issues-command';
import Routes from './routes';
import CommandsModal from '../commands-modal';
import SearchModal from '../search-modal';
import AddEditIssueModal from '../add-edit-issue-modal';

interface IMainProps {
}

interface IMainState {
  isCommandsModalOpen?: boolean;
  isSearchModalOpen?: boolean;
  isAddEditIssueModalOpen?: boolean;
}

export default class Main extends React.Component<IMainProps, IMainState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private keyboardEvents: KeyboardEvent[] = [];

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleViewCommandsCommandExecute = this.handleViewCommandsCommandExecute.bind(this);
    this.handleSearchCommandExecute = this.handleSearchCommandExecute.bind(this);
    this.handleNewIssueCommandExecute = this.handleNewIssueCommandExecute.bind(this);
    this.handleCommandsModalSelect = this.handleCommandsModalSelect.bind(this);
    this.handleCommandsModalCloseRequest = this.handleCommandsModalCloseRequest.bind(this);
    this.handleSearchModalIssueSelect = this.handleSearchModalIssueSelect.bind(this);
    this.handleSearchModalCloseRequest = this.handleSearchModalCloseRequest.bind(this);
    this.handleAddEditIssueModalSave = this.handleAddEditIssueModalSave.bind(this);
    this.handleAddEditIssueModalCloseRequest = this.handleAddEditIssueModalCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new ViewCommandsCommand(this.handleViewCommandsCommandExecute),
      new SearchCommand(this.handleSearchCommandExecute),
      new ViewIssuesCommand(),
      new UndoCommand(this.actionManager),
      new NewIssueCommand(this.handleNewIssueCommandExecute),
    ];
  }

  private handleDocumentKeyDown(event: KeyboardEvent) {
    if (isInputEvent(event))
      return;

    this.keyboardEvents.push(event);

    // Starting from the event before the last event, if we encounter a stale event, remove that event and all events before that
    for (let i = this.keyboardEvents.length - 2; i >= 0; i--) {
      if (this.keyboardEvents[i + 1].timeStamp - this.keyboardEvents[i].timeStamp > 500) {
        this.keyboardEvents.splice(0, i + 1);
        break;
      }
    }

    // Find (fully of partially) matching commands
    let matchingCommands: ICommand[] = [];
    for (let command of this.commandManager.getCommands()) {
      if (!command.shortcut)
        continue;

      if (KeyCombination.matchesSome(command.shortcut, this.keyboardEvents) > 0)
        matchingCommands.push(command);
    }

    // No mathing command
    if (matchingCommands.length === 0) {

      // Reset events
      this.keyboardEvents = [];
    }
    // One matching command
    else if (matchingCommands.length === 1) {
      let command = matchingCommands[0];

      // Fully matching command
      if (command.shortcut.length === this.keyboardEvents.length) {
        command.execute();

        event.preventDefault();
        this.keyboardEvents = [];
      }
      else {
        // Partially matching command
        // Wait for more events
      }
    }
  }

  private handleViewCommandsCommandExecute() {
    this.setState({
      isCommandsModalOpen: true,
    });
  }

  private handleSearchCommandExecute() {
    this.setState({
      isSearchModalOpen: true,
    });
  }

  private handleNewIssueCommandExecute() {
    this.setState({
      isAddEditIssueModalOpen: true,
    });
  }

  private handleCommandsModalSelect(command: ICommand) {
    command.execute();

    this.setState({
      isCommandsModalOpen: false,
    });
  }

  private handleCommandsModalCloseRequest() {
    this.setState({
      isCommandsModalOpen: false,
    });
  }

  private handleSearchModalIssueSelect(issue: IIssue) {
    this.setState({
      isSearchModalOpen: false,
    });
  }

  private handleSearchModalCloseRequest() {
    this.setState({
      isSearchModalOpen: false,
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
      <div>
        <Routes />
        <CommandsModal isOpen={this.state.isCommandsModalOpen} onSelect={this.handleCommandsModalSelect} onCloseRequest={this.handleCommandsModalCloseRequest} />
        <SearchModal isOpen={this.state.isSearchModalOpen} onIssueSelect={this.handleSearchModalIssueSelect} onCloseRequest={this.handleSearchModalCloseRequest} />
        <AddEditIssueModal isOpen={this.state.isAddEditIssueModalOpen} onSave={this.handleAddEditIssueModalSave} onCloseRequest={this.handleAddEditIssueModalCloseRequest} />
      </div>
    );
  }
};
