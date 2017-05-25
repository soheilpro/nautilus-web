import * as React from 'react';
import { IDialog } from '../../dialog';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Button from '../button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IDialogWindowProps {
  dialog: IDialog;
  onCloseRequest(): void;
}

interface IDialogWindowState {
}

export default class DialogWindow extends React.PureComponent<IDialogWindowProps, IDialogWindowState> {
  render() {
    return (
      <Window className="dialog-window-component">
        <WindowHeader>{this.props.dialog.title}</WindowHeader>
        <WindowContent>
          <div className="content">
          {this.props.dialog.content}
          </div>
        </WindowContent>
        <WindowActionBar>
          <Button autoFocus={true} onClick={this.props.onCloseRequest}>OK</Button>
        </WindowActionBar>
      </Window>
    );
  }
}
