import * as React from 'react';
import { ServiceManager } from '../../services';
import { IDialog, IDialogController } from '../../dialog';
import { IWindow } from '../../windows';
import DialogWindow from '../dialog-window';

interface IDialogControllerProps {
}

interface IDialogControllerState {
}

export default class DialogController extends React.PureComponent<IDialogControllerProps, IDialogControllerState> implements IDialogController {
  private windowController = ServiceManager.Instance.getWindowController();
  private dialogWindow: IWindow;

  constructor() {
    super();

    this.handleDialogWindowCloseRequest = this.handleDialogWindowCloseRequest.bind(this);
  }

  componentWillMount() {
    ServiceManager.Instance.setDialogController(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setDialogController(undefined);
  }

  showDialog(dialog: IDialog) {
    this.dialogWindow = {
      content: <DialogWindow dialog={dialog} onCloseRequest={this.handleDialogWindowCloseRequest} />,
      top: 120,
      width: 600,
      modal: true,
    };

    this.windowController.showWindow(this.dialogWindow);
  }

  private handleDialogWindowCloseRequest() {
    this.windowController.closeWindow(this.dialogWindow);
  }

  render() {
    return (
      <div className="dialog-controller-component">
      </div>
    );
  }
}
