import * as React from 'react';
import { IIssue } from '../../application';
import Window from '../window';
import DeleteIssueConfirmationBox from './delete-issue-confirmation-box';

interface IDeleteIssueConfirmationWindowProps {
  issue: IIssue;
  isOpen: boolean;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteIssueConfirmationWindowState {
}

export default class DeleteIssueConfirmationWindow extends React.Component<IDeleteIssueConfirmationWindowProps, IDeleteIssueConfirmationWindowState> {
  render() {
    return (
      <Window isOpen={this.props.isOpen} onCloseRequest={this.props.onCloseRequest}>
        <DeleteIssueConfirmationBox issue={this.props.issue} onConfirm={this.props.onConfirm} onCloseRequest={this.props.onCloseRequest} />
      </Window>
    );
  }
}
