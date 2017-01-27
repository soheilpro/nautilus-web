import * as React from 'react';
import { IIssue } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Button from '../button';

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
      <Window className="delete-issue-window component">
        <WindowHeader>Delete Issue</WindowHeader>
        <WindowContent>
          Are you sure you want to delete issue #{this.props.issue.sid}?
        </WindowContent>
        <WindowActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          <Button type="destructive" autoFocus={true} onClick={this.props.onConfirm}>Delete Issue</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
