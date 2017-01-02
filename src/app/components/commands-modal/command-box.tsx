import * as React from 'react';
import { ICommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import CommandList from './command-list';
import CommandSearch from './command-search';

require ('./command-box.less');

interface ISearchBoxProps {
  onCommandSelect(command: ICommand): void;
}

interface ISearchBoxState {
  commands?: ICommand[];
  selectedCommandIndex?: number;
}

export default class SearchBox extends React.Component<ISearchBoxProps, ISearchBoxState> {
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

      if (this.state.selectedCommandIndex < this.state.commands.length - 1) {
        this.setState({
          selectedCommandIndex: this.state.selectedCommandIndex + 1
        });
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedCommandIndex > 0) {
        this.setState({
          selectedCommandIndex: this.state.selectedCommandIndex - 1
        });
      }
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.commands.length > 0) {
        let command = this.state.commands[this.state.selectedCommandIndex];
        this.props.onCommandSelect(command);
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
    return commands.filter(command => !command.hidden && command.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  render() {
    return (
      <div className="search-box component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <div className="filter">
            <CommandSearch onQueryChange={this.handleCommandSearchQueryChange} />
          </div>
          <CommandList commands={this.state.commands} selectedCommandIndex={this.state.selectedCommandIndex} onCommandSelect={this.props.onCommandSelect} />
        </div>
      </div>
    );
  }
}
