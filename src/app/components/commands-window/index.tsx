import * as React from 'react';
import { ICommand } from '../../commands';
import Window from '../window';
import CommandBox from './command-box';

interface ICommandsWindowProps {
  isOpen: boolean;
  onSelect(command: ICommand): void;
  onCloseRequest(): void;
}

interface ICommandsWindowState {
}

export default class CommandsWindow extends React.Component<ICommandsWindowProps, ICommandsWindowState> {
  render() {
    return (
      <Window isOpen={this.props.isOpen} top={20} width={600} onCloseRequest={this.props.onCloseRequest}>
        <CommandBox autoFocus={true} onSelect={this.props.onSelect} />
      </Window>
    );
  }
}
