import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { ICommand } from '../../commands';
import Shortcut from '../shortcut';

require('../../assets/stylesheets/base.less');
require('./command-list.less');

interface ICommandListProps {
  commands: ICommand[];
  selectedCommandIndex: number;
  onSelect(command: ICommand): void;
}

interface ICommandListState {
}

export default class CommandList extends React.Component<ICommandListProps, ICommandListState> {
  constructor() {
    super();

    this.handleCommandClick = this.handleCommandClick.bind(this);
  }

  private handleCommandClick(command: ICommand) {
    if (command.enabled)
      this.props.onSelect(command);
  }

  render() {
    return (
      <div className="command-list-component">
        {
          this.props.commands.length > 0 ?
            <div className="commands">
              {
                this.props.commands.map((command, index) => {
                  return (
                    <a className={classNames('command', {'disabled': !command.enabled, 'selected': index === this.props.selectedCommandIndex})} onClick={_.partial(this.handleCommandClick, command)} key={command.id}>
                      <span className="title">
                        {command.name}
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
    );
  }
};
