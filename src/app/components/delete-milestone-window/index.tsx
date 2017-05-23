import * as React from 'react';
import { IMilestone } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Button from '../button';

interface IDeleteMilestoneWindowProps {
  milestone: IMilestone;
  onConfirm(): void;
  onCloseRequest(): void;
}

interface IDeleteMilestoneWindowState {
}

export default class DeleteMilestoneWindow extends React.PureComponent<IDeleteMilestoneWindowProps, IDeleteMilestoneWindowState> {
  render() {
    return (
      <Window className="delete-milestone-window-component">
        <WindowHeader>Delete Milestone</WindowHeader>
        <WindowContent>
          Are you sure you want to delete milestone #{this.props.milestone.sid}?
        </WindowContent>
        <WindowActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          <Button type="destructive" autoFocus={true} onClick={this.props.onConfirm}>Delete Milestone</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
