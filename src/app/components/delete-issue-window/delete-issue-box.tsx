import * as React from 'react';
import { IIssue } from '../../application';
import { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Button from '../button';

interface IDeleteIssueBoxProps {
  issue: IIssue;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteIssueBoxState {
}

export default class DeleteIssueBox extends React.Component<IDeleteIssueBoxProps, IDeleteIssueBoxState> {
  render() {
    return (
      <div>
        <WindowHeader>Delete Issue</WindowHeader>
        <WindowContent>
          Are you sure you want to delete issue #{this.props.issue.sid}?
        </WindowContent>
        <WindowActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          <Button type="destructive" autoFocus={true} onClick={this.props.onConfirm}>Delete Issue</Button>
        </WindowActionBar>
      </div>
    );
  }
}
