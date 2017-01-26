import * as React from 'react';
import { IIssue, IIssueChange } from '../../application';
import Window from '../window';
import AddEditIssueBox from './add-edit-issue-box';

interface IAddEditIssueWindowProps {
  mode: 'add' | 'edit';
  issue?: IIssue;
  isOpen: boolean;
  onAdd?(issue: IIssue): void;
  onUpdate?(issueChange: IIssueChange): void;
  onCloseRequest(): void;
}

interface IAddEditIssueWindowState {
}

export default class AddEditIssueWindow extends React.Component<IAddEditIssueWindowProps, IAddEditIssueWindowState> {
  render() {
    return (
      <Window isOpen={this.props.isOpen} width={800} onCloseRequest={this.props.onCloseRequest}>
        <AddEditIssueBox mode={this.props.mode} issue={this.props.issue} autoFocus={true} onAdd={this.props.onAdd} onUpdate={this.props.onUpdate} onCloseRequest={this.props.onCloseRequest} />
      </Window>
    );
  }
}
