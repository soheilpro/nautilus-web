import * as _ from 'underscore';
import * as React from 'react';
import { IIssue, IIssueChange } from '../../application';
import { IIssueController } from '../../issues';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import AddEditIssueWindow from '../add-edit-issue-window';
import AddIssueAction from './add-issue-action';
import UpdateIssueAction from './update-issue-action';
import DeleteIssueAction from './delete-issue-action';

interface IIssueControllerProps {
}

interface IIssueControllerState {
}

export default class IssueController extends React.PureComponent<IIssueControllerProps, IIssueControllerState> implements IIssueController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private dialogController = ServiceManager.Instance.getDialogController();
  private notificationController = ServiceManager.Instance.getNotificationController();
  private addIssueWindow: IWindow;
  private editIssueWindow: IWindow;

  constructor() {
    super();

    this.handleAddIssueWindowAdd = this.handleAddIssueWindowAdd.bind(this);
    this.handleAddIssueWindowClose = this.handleAddIssueWindowClose.bind(this);
    this.handleEditIssueWindowUpdate = this.handleEditIssueWindowUpdate.bind(this);
    this.handleEditIssueWindowClose = this.handleEditIssueWindowClose.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setIssueController(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setIssueController(undefined);
  }

  addIssue() {
    this.addIssueWindow = {
      content: <AddEditIssueWindow mode="add" onAdd={this.handleAddIssueWindowAdd} onClose={this.handleAddIssueWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.addIssueWindow);
  }

  editIssue(issue: IIssue) {
    this.editIssueWindow = {
      content: <AddEditIssueWindow mode="edit" issue={issue} onUpdate={_.partial(this.handleEditIssueWindowUpdate, issue)} onClose={this.handleEditIssueWindowClose} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.editIssueWindow);
  }

  deleteIssue(issue: IIssue) {
    this.dialogController.showConfirmDialog({
      title: 'Delete Issue',
      message: `Are you sure you want to delete issue #${issue.sid}?`,
      buttonTitle: 'Delete Issue',
      destructive: true,
      onConfirm: async () => {
        const notification = {
          title: 'Deleting issue...',
        };

        this.notificationController.showNotification(notification);

        await this.actionManager.execute(new DeleteIssueAction(issue, this.application));

        this.notificationController.hideNotification(notification);
      },
    });
  }

  private async handleAddIssueWindowAdd(issue: IIssue) {
    this.windowController.closeWindow(this.addIssueWindow);

    const notification = {
      title: 'Adding issue...',
    };

    this.notificationController.showNotification(notification);

    await this.actionManager.execute(new AddIssueAction(issue, this.application));

    this.notificationController.hideNotification(notification);
  }

  private handleAddIssueWindowClose() {
    this.windowController.closeWindow(this.addIssueWindow);
  }

  private async handleEditIssueWindowUpdate(issue: IIssue, issueChange: IIssueChange) {
    this.windowController.closeWindow(this.editIssueWindow);

    const notification = {
      title: 'Editing issue...',
    };

    this.notificationController.showNotification(notification);

    await this.actionManager.execute(new UpdateIssueAction(issue, issueChange, this.application));

    this.notificationController.hideNotification(notification);
  }

  private handleEditIssueWindowClose() {
    this.windowController.closeWindow(this.editIssueWindow);
  }

  render() {
    return (
      <div className="issue-controller-component">
      </div>
    );
  }
};
