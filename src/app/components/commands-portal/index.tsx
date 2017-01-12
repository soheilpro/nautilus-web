import * as React from 'react';
import { ICommandProvider, ICommand } from '../../commands';
import { KeyCode, KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
import ViewCommandsCommand from './view-commands-command';
import CommandsModal from '../commands-modal';
import UndoCommand from './undo-command';
import ViewIssuesCommand from './view-issues-command';

interface ICommandsPortalProps {
}

interface ICommandsPortalState {
  isCommandsModalOpen?: boolean;
}

export default class CommandsPortal extends React.Component<ICommandsPortalProps, ICommandsPortalState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private keyboardEvents: KeyboardEvent[] = [];

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleViewCommandsCommandExecute = this.handleViewCommandsCommandExecute.bind(this);
    this.handleCommandsModalSelect = this.handleCommandsModalSelect.bind(this);
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
      new ViewCommandsCommand(this.handleViewCommandsCommandExecute),
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

  render() {
    return (
      <div className="commands-portal component">
        <CommandsModal isOpen={this.state.isCommandsModalOpen} onSelect={this.handleCommandsModalSelect} onCloseRequest={this.handleCommandsModalCloseRequest} />
      </div>
    );
  }
};
