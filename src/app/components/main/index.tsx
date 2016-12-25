import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ServiceManager from '../../service-manager';
import { Command, ICommandProvider, ICommand } from '../../controller';
import { KeyCode, KeyCombination, isInputEvent } from '../../keyboard';
import Issues from '../issues';
import Milestones from '../milestones';
import Projects from '../projects';
import CommandPalette from '../command-palette';

class MainRouter extends React.Component<{}, {}> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={Issues}/>
        <Route path="/milestones" component={Milestones}/>
        <Route path="/projects" component={Projects}/>
      </Router>
    );
  }
}

interface IMainState {
  isCommandPalleteVisible?: boolean;
}

export default class Main extends React.Component<{}, IMainState> implements ICommandProvider {
  private controller = ServiceManager.Instance.getController();
  private keyboardEvents: KeyboardEvent[] = [];

  constructor() {
    super();

    this.handleCommandPaletteSelectCommand = this.handleCommandPaletteSelectCommand.bind(this);
    this.handleCommandPaletteDismiss = this.handleCommandPaletteDismiss.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    document.addEventListener('keydown', this.handleKeyDown);

    this.state = {};
  }

  componentWillMount() {
    this.controller.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.controller.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new Command({
        id: 'show-command-palette',
        name: 'Show Command Palette',
        doAction: () => { this.setState({ isCommandPalleteVisible: true }); },
        shortcut: { keyCombinations: [{ which: KeyCode.P }], },
        hidden: true,
      }),
      new Command({
        id: 'go-to-issues',
        name: 'Go to Issues',
        shortcut: { keyCombinations: [{ which: KeyCode.G }, { which: KeyCode.I }], },
        doAction: () => { browserHistory.push('/'); },
      }),
      new Command({
        id: 'go-to-milestones',
        name: 'Go to Milestones',
        shortcut: { keyCombinations: [{ which: KeyCode.G }, { which: KeyCode.M }], },
        doAction: () => { browserHistory.push('/milestones'); },
      }),
      new Command({
        id: 'go-to-projects',
        name: 'Go to Projects',
        shortcut: { keyCombinations: [{ which: KeyCode.G }, { which: KeyCode.P }], },
        doAction: () => { browserHistory.push('/projects'); },
      }),
    ];
  }

  private handleKeyDown(event: KeyboardEvent) {
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

    for (let command of this.controller.getCommands()) {
      if (!command.shortcut)
        continue;

      if (!KeyCombination.matchesAll(command.shortcut.keyCombinations, this.keyboardEvents))
        continue;

      event.preventDefault();
      this.keyboardEvents = [];

      command.do();
      break;
    }
  }

  private handleCommandPaletteSelectCommand(command: ICommand) {
    command.do();

    this.setState({
      isCommandPalleteVisible: false
    });
  }

  private handleCommandPaletteDismiss() {
    this.setState({
      isCommandPalleteVisible: false
    });
  }

  render() {
    return (
      <div>
        <MainRouter />
        {
          this.state.isCommandPalleteVisible ?
            <CommandPalette commands={this.controller.getCommands()} onSelectCommand={this.handleCommandPaletteSelectCommand} onDismiss={this.handleCommandPaletteDismiss} />
            : null
        }
      </div>
    );
  }
};
