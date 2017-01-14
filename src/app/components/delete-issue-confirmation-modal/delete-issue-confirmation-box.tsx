import * as React from 'react';
import { IIssue } from '../../application';
import { ModalHeader, ModalContent, ModalActionBar } from '../modal';
import Button from '../button';

interface IDeleteIssueConfirmationBoxProps {
  issue: IIssue;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteIssueConfirmationBoxState {
}

export default class DeleteIssueConfirmationBox extends React.Component<IDeleteIssueConfirmationBoxProps, IDeleteIssueConfirmationBoxState> {
  render() {
    return (
      <div>
        <ModalHeader>Delete Issue</ModalHeader>
        <ModalContent>
          Are you sure you want to delete issue #{this.props.issue.sid}?
        </ModalContent>
        <ModalActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          <Button type="destructive" autoFocus={true} onClick={this.props.onConfirm}>Delete Issue</Button>
        </ModalActionBar>
      </div>
    );
  }
}
