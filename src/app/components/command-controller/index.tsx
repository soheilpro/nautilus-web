import * as React from 'react';
import { ICommandProvider, ICommand, ICommandController } from '../../commands';
import { KeyCombination, isInputEvent } from '../../keyboard';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import ViewCommandsCommand from './view-commands-command';
import CommandsWindow from '../commands-window';
import UndoCommand from './undo-command';

interface ICommandControllerProps {
}

interface ICommandControllerState {
}

export default class CommandController extends React.Component<ICommandControllerProps, ICommandControllerState> implements ICommandController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private commandShortcutsDisabledCounter: number = 0;
  private keyboardEvents: KeyboardEvent[] = [];
  private commandsWindow: IWindow;

  constructor() {
    super();

    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
    this.handleCommandsWindowSelect = this.handleCommandsWindowSelect.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setCommandController(this);
    this.commandManager.registerCommandProvider(this);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setCommandController(undefined);
  }

  disableCommandShortcuts() {
    this.commandShortcutsDisabledCounter++;
  }

  enableCommandShortcuts() {
    this.commandShortcutsDisabledCounter--;
  }

  showCommandsWindow() {
    this.commandsWindow = {
      content: <CommandsWindow onSelect={this.handleCommandsWindowSelect} />,
      top: 20,
      closeOnBlur: true,
      closeOnEsc: true,
    };

    this.windowController.showWindow(this.commandsWindow);
  }

  getCommands() {
    return [
      new ViewCommandsCommand(),
      new UndoCommand(),
    ];
  }

  private handleDocumentKeyDown(event: KeyboardEvent) {
    if (this.commandShortcutsDisabledCounter > 0)
      return;

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

  private handleCommandsWindowSelect(command: ICommand) {
    this.windowController.closeWindow(this.commandsWindow, () => {
      command.execute();
    });
  }

  render() {
    return (
      <div className="command-controller component">
      </div>
    );
  }
};
