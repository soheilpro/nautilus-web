import * as React from 'react';
import { ICommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import Window from '../window';
import CommandList from './command-list';
import CommandSearch from './command-search';

require ('./index.less');

interface ICommandsWindowProps {
  onSelect(command: ICommand): void;
}

interface ICommandsWindowState {
  commands?: ICommand[];
  selectedCommandIndex?: number;
}

export default class CommandsWindow extends React.Component<ICommandsWindowProps, ICommandsWindowState> {
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleCommandSearchQueryChange = this.handleCommandSearchQueryChange.bind(this);

    this.state = {
      commands: this.filter(this.commandManager.getCommands(), ''),
      selectedCommandIndex: 0,
    };
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState({
        selectedCommandIndex: this.state.selectedCommandIndex < this.state.commands.length - 1 ? this.state.selectedCommandIndex + 1 : 0,
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState({
        selectedCommandIndex: this.state.selectedCommandIndex > 0 ? this.state.selectedCommandIndex - 1 : this.state.commands.length - 1,
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.commands.length > 0) {
        let command = this.state.commands[this.state.selectedCommandIndex];

        if (command.enabled)
          this.props.onSelect(command);
      }
    }
  }

  private async handleCommandSearchQueryChange(query: string) {
    query = query.trim();

    this.setState({
      commands: this.filter(this.commandManager.getCommands(), query),
      selectedCommandIndex: 0,
    });
  }

  private filter(commands: ICommand[], query: string) {
    return commands.filter(command => command.visible && command.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  render() {
    return (
      <Window className="commands-window component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <div className="filter">
            <CommandSearch autoFocus={true} onQueryChange={this.handleCommandSearchQueryChange} />
          </div>
          <CommandList commands={this.state.commands} selectedCommandIndex={this.state.selectedCommandIndex} onSelect={this.props.onSelect} />
        </div>
      </Window>
    );
  }
}
