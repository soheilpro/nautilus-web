import * as React from 'react';
import { browserHistory } from 'react-router';
import { Command, ICommand, ICommandProvider } from '../../commands';
import { KeyCode, KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
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
      new Command({
        id: 'search-commands',
        name: 'Search commands',
        shortcuts: [[{ keyCode: KeyCode.P }]],
        hidden: true,
        onExecute: () => { this.setState({ isCommandsModalOpen: true }); },
      }),
      new Command({
        id: 'search-issues',
        shortcuts: [[{ keyCode: KeyCode.S }]],
        name: 'Search',
        onExecute: () => { this.setState({ isSearchModalOpen: true }); }
      }),
      new Command({
        id: 'go-to-issues',
        name: 'Go to Issues',
        shortcuts: [[{ keyCode: KeyCode.G }, { keyCode: KeyCode.I }]],
        onExecute: () => { browserHistory.push('/'); },
      }),
      new Command({
        id: 'go-to-milestones',
        shortcuts: [[{ keyCode: KeyCode.G }, { keyCode: KeyCode.M }]],
        name: 'Go to Milestones',
        onExecute: () => { browserHistory.push('/milestones'); },
      }),
      new Command({
        id: 'go-to-projects',
        name: 'Go to Projects',
        shortcuts: [[{ keyCode: KeyCode.G }, { keyCode: KeyCode.P }]],
        onExecute: () => { browserHistory.push('/projects'); },
      }),
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
