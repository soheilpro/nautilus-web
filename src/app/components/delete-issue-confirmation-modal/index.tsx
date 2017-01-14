import * as React from 'react';
import { IIssue } from '../../application';
import Modal from '../modal';
import DeleteIssueConfirmationBox from './delete-issue-confirmation-box';

interface IDeleteIssueConfirmationModalProps {
  issue: IIssue;
  isOpen: boolean;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteIssueConfirmationModalState {
}

export default class DeleteIssueConfirmationModal extends React.Component<IDeleteIssueConfirmationModalProps, IDeleteIssueConfirmationModalState> {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} onCloseRequest={this.props.onCloseRequest}>
        <DeleteIssueConfirmationBox issue={this.props.issue} onConfirm={this.props.onConfirm} onCloseRequest={this.props.onCloseRequest} />
      </Modal>
    );
  }
}
