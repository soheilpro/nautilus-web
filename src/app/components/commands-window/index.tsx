import * as React from 'react';
import { ICommand } from '../../commands';
import Window from '../window';
import CommandBox from './command-box';

interface ICommandsWindowProps {
  onSelect(command: ICommand): void;
  onCloseRequest(): void;
}

interface ICommandsWindowState {
}

export default class CommandsWindow extends React.Component<ICommandsWindowProps, ICommandsWindowState> {
  render() {
    return (
      <Window onCloseRequest={this.props.onCloseRequest}>
        <CommandBox autoFocus={true} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
