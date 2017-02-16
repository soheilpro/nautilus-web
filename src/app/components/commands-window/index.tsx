import * as _ from 'underscore';
import * as React from 'react';
import { ICommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import Window from '../window';
import CommandList from './command-list';
import CommandSearch from './command-search';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface ICommandsWindowProps {
  onSelect(command: ICommand): void;
}

interface ICommandsWindowState {
  filteredCommands?: ICommand[];
  selectedCommandIndex?: number;
}

export default class CommandsWindow extends React.Component<ICommandsWindowProps, ICommandsWindowState> {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private commands = _.sortBy(this.commandManager.getCommands(), command => command.name);

  constructor() {
    super();

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleCommandSearchQueryChange = this.handleCommandSearchQueryChange.bind(this);

    this.state = {
      filteredCommands: this.commands,
      selectedCommandIndex: 0,
    };
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState({
        selectedCommandIndex: this.state.selectedCommandIndex < this.state.filteredCommands.length - 1 ? this.state.selectedCommandIndex + 1 : 0,
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState({
        selectedCommandIndex: this.state.selectedCommandIndex > 0 ? this.state.selectedCommandIndex - 1 : this.state.filteredCommands.length - 1,
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.filteredCommands.length > 0) {
        let command = this.state.filteredCommands[this.state.selectedCommandIndex];

        if (command.enabled)
          this.props.onSelect(command);
      }
    }
  }

  private async handleCommandSearchQueryChange(query: string) {
    query = query.trim();

    this.setState({
      filteredCommands: this.filter(this.commands, query),
      selectedCommandIndex: 0,
    });
  }

  private filter(commands: ICommand[], query: string) {
    return commands.filter(command => command.visible && command.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  render() {
    return (
      <Window className="commands-window-component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <div className="filter">
            <CommandSearch autoFocus={true} onQueryChange={this.handleCommandSearchQueryChange} />
          </div>
          <CommandList commands={this.state.filteredCommands} selectedCommandIndex={this.state.selectedCommandIndex} onSelect={this.props.onSelect} />
        </div>
      </Window>
    );
  }
}
