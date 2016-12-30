import * as React from 'react';
import * as classNames from 'classnames';
import { ServiceManager } from '../../services';
import { ICommand } from '../../commands';
import Modal from '../modal';
import CommandList from './command-list';

interface ICommandsModalProps {
  isOpen: boolean;
  onCommandSelect(command: ICommand): void;
  onCloseRequest(): void;
}

interface ICommandsModalState {
}

export default class CommandsModal extends React.Component<ICommandsModalProps, ICommandsModalState> {
  private commandManager = ServiceManager.Instance.getCommandManager();

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onCloseRequest={this.props.onCloseRequest}>
        <CommandList commands={this.commandManager.getCommands()} onCommandSelect={this.props.onCommandSelect} onCloseRequest={this.props.onCloseRequest} />
      </Modal>
    );
  }
}
