import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { ICommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import Window from '../window';
import Input from '../input';
import Shortcut from '../shortcut';

require('../../assets/stylesheets/base.less');
require ('./index.less');

interface ICommandPaletteWindowProps {
  commands: ICommand[];
  onSelect(command: ICommand): void;
}

interface ICommandPaletteWindowState {
  commands?: ICommand[];
  selectedCommandIndex?: number;
  searchText?: string;
}

export default class CommandPaletteWindow extends React.Component<ICommandPaletteWindowProps, ICommandPaletteWindowState> {
  constructor(props: ICommandPaletteWindowProps) {
    super(props);

    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleCommandListMouseLeave = this.handleCommandListMouseLeave.bind(this);
    this.handleCommandMouseEnter = this.handleCommandMouseEnter.bind(this);
    this.handleCommandClick = this.handleCommandClick.bind(this);

    this.state = {
      commands: props.commands,
      selectedCommandIndex: -1,
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
        if (this.state.selectedCommandIndex !== -1) {
          const command = this.state.commands[this.state.selectedCommandIndex];

          if (command.enabled)
            this.props.onSelect(command);
        }
      }
    }
  }

  private async handleSearchInputChange(value: string) {
    this.setState({
      searchText: value,
      commands: this.filterCommands(this.props.commands, value),
      selectedCommandIndex: 0,
    });
  }

  private handleCommandListMouseLeave() {
    this.setState({
      selectedCommandIndex: -1,
    });
  }

  private handleCommandMouseEnter(command: ICommand) {
    this.setState({
      selectedCommandIndex: this.state.commands.indexOf(command),
    });
  }

  private handleCommandClick(command: ICommand, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (command.enabled)
      this.props.onSelect(command);
  }

  private filterCommands(commands: ICommand[], text: string) {
    if (!text)
      return commands;

    text = text.toLowerCase().trim();

    return commands.filter(command => command.title.toLowerCase().indexOf(text) !== -1);
  }

  render() {
    return (
      <Window className="command-palette-window-component">
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
          <Input className="search-input" placeholder="Search commands" value={this.state.searchText} autoFocus={true} onChange={this.handleSearchInputChange} />
          {
            this.state.commands.length > 0 ?
              <div className="command-list" onMouseLeave={this.handleCommandListMouseLeave}>
                {
                  this.state.commands.map((command, index) => {
                    return (
                      <a className={classNames('command', {'disabled': !command.enabled, 'selected': index === this.state.selectedCommandIndex})} href="#" onClick={_.partial(this.handleCommandClick, command)} onMouseEnter={_.partial(this.handleCommandMouseEnter, command)} key={command.id}>
                        <span className="title">
                          {command.title}
                        </span>
                        <span className="shortcut">
                          <Shortcut shortcut={command.shortcut} />
                        </span>
                      </a>
                    );
                  })
                }
              </div>
              :
              <div className="no-commands-found">
                No commands found.
              </div>
          }
        </div>
      </Window>
    );
  }
}
