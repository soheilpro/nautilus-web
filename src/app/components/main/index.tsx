import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ServiceManager from '../../service-manager';
import { Command, ICommandProvider, ICommand } from '../../controller';
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
      new Command('go-to-issues', 'Go to Issues', () => { browserHistory.push('/'); }),
      new Command('go-to-milestones', 'Go to Milestones', () => { browserHistory.push('/milestones'); }),
      new Command('go-to-projects', 'Go to Projects', () => { browserHistory.push('/projects'); }),
    ];
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.which === 80) {
      event.preventDefault();

      this.setState({
        isCommandPalleteVisible: true
      });
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
