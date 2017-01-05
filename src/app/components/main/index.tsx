import * as React from 'react';
import { ICommand, ICommandProvider } from '../../commands';
import { KeyCode, KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
import SearchCommandsCommand from './search-commands-command';
import SearchIssuesCommand from './search-issues-command';
import UndoCommand from './undo-command';
import ViewIssuesCommand from './view-issues-command';
import Routes from './routes';
import CommandsModal from '../commands-modal';
import SearchModal, { ISearchResult } from '../search-modal';

interface IMainProps {
}

interface IMainState {
  isCommandsModalOpen?: boolean;
  isSearchModalOpen?: boolean;
}

export default class Main extends React.Component<IMainProps, IMainState> implements ICommandProvider {
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private keyboardEvents: KeyboardEvent[] = [];

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleCommandsModalCommandSelect = this.handleCommandsModalCommandSelect.bind(this);
    this.handleCommandsModalCloseRequest = this.handleCommandsModalCloseRequest.bind(this);
    this.handleSearchModalSearchResultSelect = this.handleSearchModalSearchResultSelect.bind(this);
    this.handleSearchModalCloseRequest = this.handleSearchModalCloseRequest.bind(this);

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
      new SearchCommandsCommand(this),
      new SearchIssuesCommand(this),
      new ViewIssuesCommand(),
      new UndoCommand(this.actionManager),
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

    let command = this.findCommandByShortcut(this.keyboardEvents);

    if (command) {
      command.execute();

      event.preventDefault();
      this.keyboardEvents = [];
    }
  }

  private findCommandByShortcut(keyboardEvents: KeyboardEvent[]) {
    for (let command of this.commandManager.getCommands())
      for (let shortcut of command.shortcuts)
        if (KeyCombination.matchesAll(shortcut, keyboardEvents))
          return command;

    return null;
  }

  private handleCommandsModalCommandSelect(command: ICommand) {
    command.execute();

    this.setState({
      isCommandsModalOpen: false
    });
  }

  private handleCommandsModalCloseRequest() {
    this.setState({
      isCommandsModalOpen: false
    });
  }

  private handleSearchModalSearchResultSelect(searchResult: ISearchResult) {
    this.setState({
      isSearchModalOpen: false
    });
  }

  private handleSearchModalCloseRequest() {
    this.setState({
      isSearchModalOpen: false
    });
  }

  render() {
    return (
      <div>
        <Routes />
        <CommandsModal isOpen={this.state.isCommandsModalOpen} onCommandSelect={this.handleCommandsModalCommandSelect} onCloseRequest={this.handleCommandsModalCloseRequest} />
        <SearchModal isOpen={this.state.isSearchModalOpen} onSearchResultSelect={this.handleSearchModalSearchResultSelect} onCloseRequest={this.handleSearchModalCloseRequest} />
      </div>
    );
  }
};
