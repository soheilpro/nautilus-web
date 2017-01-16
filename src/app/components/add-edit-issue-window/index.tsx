import * as React from 'react';
import { IIssue } from '../../application';
import Window from '../window';
import AddEditIssueBox from './add-edit-issue-box';

interface IAddEditIssueWindowProps {
  isOpen: boolean;
  onSave(issue: IIssue): void;
  onCloseRequest(): void;
}

interface IAddEditIssueWindowState {
}

export default class AddEditIssueWindow extends React.Component<IAddEditIssueWindowProps, IAddEditIssueWindowState> {
  render() {
    return (
      <Window isOpen={this.props.isOpen} width={800} onCloseRequest={this.props.onCloseRequest}>
        <AddEditIssueBox onSave={this.props.onSave} autoFocus={true} onCloseRequest={this.props.onCloseRequest} />
      </Window>
    );
  }
}
