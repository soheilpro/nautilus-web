import * as React from 'react';
import { browserHistory } from 'react-router';
import { Command, ICommand, ICommandProvider } from '../../commands';
import { KeyCode, KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
import Routes from './routes';
import CommandsModal from '../commands-modal';

interface IMainProps {
}

interface IMainState {
  isCommandsModalOpen?: boolean;
}

export default class Main extends React.Component<IMainProps, IMainState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private keyBindingManager = ServiceManager.Instance.getKeyBindingManager();
  private keyboardEvents: KeyboardEvent[] = [];

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleCommandsModalCommandSelect = this.handleCommandsModalCommandSelect.bind(this);
    this.handleCommandsModalCloseRequest = this.handleCommandsModalCloseRequest.bind(this);

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
        id: 'show-command-palette',
        name: 'Show Command Palette',
        doAction: () => { this.setState({ isCommandsModalOpen: true }); },
        hidden: true,
      }),
      new Command({
        id: 'go-to-issues',
        name: 'Go to Issues',
        doAction: () => { browserHistory.push('/'); },
      }),
      new Command({
        id: 'go-to-milestones',
        name: 'Go to Milestones',
        doAction: () => { browserHistory.push('/milestones'); },
      }),
      new Command({
        id: 'go-to-projects',
        name: 'Go to Projects',
        doAction: () => { browserHistory.push('/projects'); },
      }),
    ];
  }

  private handleDocumentKeyDown(event: KeyboardEvent) {
    if (isInputEvent(event))
      return;

    this.keyboardEvents.push(event);

    // Starting from the one before the last event, if we encounter a stale event, remove that event and all events before that
    for (let i = this.keyboardEvents.length - 2; i >= 0; i--) {
      if (this.keyboardEvents[i + 1].timeStamp - this.keyboardEvents[i].timeStamp > 500) {
        this.keyboardEvents.splice(0, i + 1);
        break;
      }
    }

    for (let keyBinding of this.keyBindingManager.getKeyBindings()) {
      if (!KeyCombination.matchesAll(keyBinding.shortcut, this.keyboardEvents))
        continue;

      let command = this.commandManager.getCommand(keyBinding.commandId);

      if (!command)
        return;

      command.do();

      event.preventDefault();
      this.keyboardEvents = [];

      break;
    }
  }

  private handleCommandsModalCommandSelect(command: ICommand) {
    command.do();

    this.setState({
      isCommandsModalOpen: false
    });
  }

  private handleCommandsModalCloseRequest() {
    this.setState({
      isCommandsModalOpen: false
    });
  }

  render() {
    return (
      <div>
        <Routes />
        <CommandsModal isOpen={this.state.isCommandsModalOpen} onCommandSelect={this.handleCommandsModalCommandSelect} onCloseRequest={this.handleCommandsModalCloseRequest} />
      </div>
    );
  }
};
