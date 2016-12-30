import * as React from 'react';
import * as classNames from 'classnames';
import { ICommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import Shortcut from '../shortcut';

require('./command-list.less');

interface ICommandListProps {
  commands: ICommand[];
  onCommandSelect(command: ICommand): void;
  onCloseRequest(): void;
}

interface ICommandListState {
  searchQuery?: string;
  filteredCommands?: ICommand[];
  selectedCommandIndex?: number;
}

export default class CommandList extends React.Component<ICommandListProps, ICommandListState> {
  private keyBindingManager = ServiceManager.Instance.getKeyBindingManager();
  private searchQueryElement: HTMLElement;

  constructor(props: ICommandListProps) {
    super();

    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handleSearchQueryKeyDown = this.handleSearchQueryKeyDown.bind(this);
    this.handleCommandClick = this.handleCommandClick.bind(this);

    this.state = {
      searchQuery: '',
      filteredCommands: this.filterCommands(props.commands, ''),
      selectedCommandIndex: 0,
    };
  }

  componentDidMount() {
    this.searchQueryElement.focus();
  }

  private handleSearchQueryChange(event: React.FormEvent<HTMLInputElement>) {
    let query = (event.target as HTMLInputElement).value;

    this.setState({
      searchQuery: query,
      filteredCommands: this.filterCommands(this.props.commands, query),
      selectedCommandIndex: 0,
    });
  }

  private handleSearchQueryKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedCommandIndex < this.state.filteredCommands.length - 1) {
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
      if (this.state.filteredCommands.length === 0)
        return;

      event.preventDefault();

      let command = this.state.filteredCommands[this.state.selectedCommandIndex];
      this.props.onCommandSelect(command);
    }
  }

  private handleCommandClick(command: ICommand) {
    this.props.onCommandSelect(command);
  }

  private filterCommands(commands: ICommand[], query: string) {
    return commands.filter(command => !command.hidden && command.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  render() {
    return (
      <div className="command-list component">
        <input placeholder="Search commands" className="search" value={this.state.searchQuery} onChange={this.handleSearchQueryChange} onKeyDown={this.handleSearchQueryKeyDown} ref={e => this.searchQueryElement = e} />
        <div className="commands">
          {
            this.state.filteredCommands.map((command, index) => {
              return (
                <a className={classNames('command', {'selected': index === this.state.selectedCommandIndex})} onClick={this.handleCommandClick.bind(null, command)} key={command.id}>
                  <span className="title">
                    {command.name}
                  </span>
                  <span className="shortcut">
                    <Shortcut shortcut={this.keyBindingManager.getKeyBindings().filter(keyBinding => keyBinding.commandId === command.id).map(keyBinding => keyBinding.shortcut)[0]} />
                  </span>
                </a>
              );
            })
          }
        </div>
        {
          this.state.filteredCommands.length === 0 ?
            <div className="no-commands-matching">
              No commands matching.
            </div>
            : null
        }
      </div>
    );
  }
};
