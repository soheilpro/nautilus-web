import * as React from 'react';
import * as classNames from 'classnames';
import { ICommand } from '../../commands';
import { IIssue } from '../../application';
import Shortcut from '../shortcut';

require('./command-list.less');

interface ICommandListProps {
  commands: ICommand[];
  selectedCommandIndex: number;
  onCommandSelect(command: ICommand): void;
}

interface ICommandListState {
}

export default class CommandList extends React.Component<ICommandListProps, ICommandListState> {
  constructor() {
    super();

    this.handleCommandClick = this.handleCommandClick.bind(this);
  }

  private handleCommandClick(command: ICommand) {
    this.props.onCommandSelect(command);
  }

  render() {
    return (
      <div className="command-list component">
        {
          this.props.commands.length > 0 ?
            <div className="commands">
              {
                this.props.commands.map((command, index) => {
                  return (
                    <a className={classNames('command', {'selected': index === this.props.selectedCommandIndex})} onClick={this.handleCommandClick.bind(null, command)} key={command.id}>
                      <span className="title">
                        {command.name}
                      </span>
                      <span className="shortcut">
                        <Shortcut shortcut={command.shortcuts[0]} />
                      </span>
                    </a>
                  );
                })
              }
            </div>
            :
            <div className="no-commands-found">
              No results found.
            </div>
        }
      </div>
    );
  }
};