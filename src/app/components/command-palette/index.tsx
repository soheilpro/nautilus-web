import * as React from 'react';
import * as classNames from 'classnames';
import { ServiceManager } from '../../services';
import { ICommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import Shortcut from '../shortcut';

interface ICommandPaletteProps {
  commands: ICommand[];
  onSelectCommand(command: ICommand): void;
  onDismiss(): void;
}

interface ICommandPaletteState {
  searchQuery?: string;
  filteredCommands?: ICommand[];
  selectedCommandIndex?: number;
}

require('./index.less');

export default class CommandPalette extends React.Component<ICommandPaletteProps, ICommandPaletteState> {
  private keyBindingManager = ServiceManager.Instance.getKeyBindingManager();
  private containerElement: HTMLElement;
  private searchQueryElement: HTMLElement;

  constructor(props: ICommandPaletteProps) {
    super(props);

    this.handleContainerBlur = this.handleContainerBlur.bind(this);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
    this.handleSearchQueryKeyDown = this.handleSearchQueryKeyDown.bind(this);
    this.handleCommandSelect = this.handleCommandSelect.bind(this);

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
    if (event.which === KeyCode.Escape) {
      event.preventDefault();

      if (this.props.onDismiss)
        this.props.onDismiss();
    }
    else if (event.which === KeyCode.DownArrow) {
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

      if (this.props.onSelectCommand)
        this.props.onSelectCommand(command);
    }
  }

  private handleContainerBlur(event: React.FocusEvent<HTMLDivElement>) {
    setTimeout(() => {
      if (!this.containerElement)
        return;

      if (this.containerElement.contains(document.activeElement))
        return;

      if (this.props.onDismiss)
        this.props.onDismiss();
    }, 0);
  }

  private handleCommandSelect(command: ICommand) {
    if (this.props.onSelectCommand)
      this.props.onSelectCommand(command);
  }

  private filterCommands(commands: ICommand[], query: string) {
    return commands.filter(command => !command.hidden && command.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }

  render() {
    return (
      <div className="command-palette component">
        <div className="container" tabIndex={0} onBlur={this.handleContainerBlur} ref={e => this.containerElement = e}>
          <input placeholder="Search commands" className="search" value={this.state.searchQuery} onChange={this.handleSearchQueryChange} onKeyDown={this.handleSearchQueryKeyDown} ref={e => this.searchQueryElement = e} />
          <div className="command-list">
            {
              this.state.filteredCommands.map((command, index) => {
                return (
                  <a className={classNames('command', {'selected': index === this.state.selectedCommandIndex})} onClick={this.handleCommandSelect.bind(null, command)} key={command.id}>
                    <span className="title">
                      {command.name}
                    </span>
                    <span className="shortcut">
                      <Shortcut shortcut={this.keyBindingManager.getShortcutsForCommand(command.id)[0]} />
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
      </div>
    );
  }
};
