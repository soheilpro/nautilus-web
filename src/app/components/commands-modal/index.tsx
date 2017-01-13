import * as React from 'react';
import { ICommand } from '../../commands';
import Modal from '../modal';
import CommandBox from './command-box';

interface ICommandsModalProps {
  isOpen: boolean;
  onSelect(command: ICommand): void;
  onCloseRequest(): void;
}

interface ICommandsModalState {
}

export default class CommandsModal extends React.Component<ICommandsModalProps, ICommandsModalState> {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} top={20} width={600} onCloseRequest={this.props.onCloseRequest}>
        <CommandBox autoFocus={true} onSelect={this.props.onSelect} />
      </Modal>
    );
  }
}
