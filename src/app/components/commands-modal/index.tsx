import * as React from 'react';
import * as classNames from 'classnames';
import { ICommand } from '../../commands';
import { ServiceManager } from '../../services';
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
      <Modal isOpen={this.props.isOpen} onCloseRequest={this.props.onCloseRequest}>
        <CommandBox autoFocus={true} onSelect={this.props.onSelect} />
      </Modal>
    );
  }
}
