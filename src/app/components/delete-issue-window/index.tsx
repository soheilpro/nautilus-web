import * as React from 'react';
import { IIssue } from '../../application';
import Window from '../window';
import DeleteIssueBox from './delete-issue-box';

interface IDeleteIssueWindowProps {
  issue: IIssue;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteIssueWindowState {
}

export default class DeleteIssueWindow extends React.Component<IDeleteIssueWindowProps, IDeleteIssueWindowState> {
  render() {
    return (
      <Window>
        <DeleteIssueBox issue={this.props.issue} onConfirm={this.props.onConfirm} onCloseRequest={this.props.onCloseRequest} />
      </Window>
    );
  }
}
