import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, IMilestoneChange } from '../../application';
import { IMilestoneController } from '../../milestones';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import AddEditMilestoneWindow from '../add-edit-milestone-window';
import AddMilestoneAction from './add-milestone-action';
import UpdateMilestoneAction from './update-milestone-action';
import DeleteMilestoneAction from './delete-milestone-action';

interface IMilestoneControllerProps {
}

interface IMilestoneControllerState {
}

export default class MilestoneController extends React.PureComponent<IMilestoneControllerProps, IMilestoneControllerState> implements IMilestoneController {
  private application = ServiceManager.Instance.getApplication();
  private actionManager = ServiceManager.Instance.getActionManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private dialogController = ServiceManager.Instance.getDialogController();
  private addMilestoneWindow: IWindow;
  private editMilestoneWindow: IWindow;

  constructor() {
    super();

    this.handleAddMilestoneWindowAdd = this.handleAddMilestoneWindowAdd.bind(this);
    this.handleAddMilestoneWindowCloseRequest = this.handleAddMilestoneWindowCloseRequest.bind(this);
    this.handleEditMilestoneWindowUpdate = this.handleEditMilestoneWindowUpdate.bind(this);
    this.handleEditMilestoneWindowCloseRequest = this.handleEditMilestoneWindowCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setMilestoneController(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setMilestoneController(undefined);
  }

  addMilestone() {
    this.addMilestoneWindow = {
      content: <AddEditMilestoneWindow mode="add" onAdd={this.handleAddMilestoneWindowAdd} onCloseRequest={this.handleAddMilestoneWindowCloseRequest} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.addMilestoneWindow);
  }

  editMilestone(milestone: IMilestone) {
    this.editMilestoneWindow = {
      content: <AddEditMilestoneWindow mode="edit" milestone={milestone} onUpdate={_.partial(this.handleEditMilestoneWindowUpdate, milestone)} onCloseRequest={this.handleEditMilestoneWindowCloseRequest} />,
      top: 120,
      width: 800,
      modal: true,
    };

    this.windowController.showWindow(this.editMilestoneWindow);
  }

  async deleteMilestone(milestone: IMilestone) {
    const filter = new NQL.ComparisonExpression(
      new NQL.LocalExpression('milestone'),
      new NQL.ConstantExpression(milestone, 'Milestone'),
      '='
    );

    const milestoneIssues = await this.application.items.getAllIssues(filter, null);

    if (milestoneIssues.length > 0) {
      this.dialogController.showErrorDialog({
        title: 'Delete Milestone',
        message: `Cannot delete milestone #${milestone.sid}.\nThere are ${milestoneIssues.length} issue(s) attached to this milestone.`},
      );

      return;
    }

    this.dialogController.showConfirmDialog({
      title: 'Delete Milestone',
      message: `Are you sure you want to delete milestone #${milestone.sid}?`,
      buttonTitle: 'Delete Milestone',
      isDestructive: true,
      onConfirm: () => {
        this.actionManager.execute(new DeleteMilestoneAction(milestone, this.application));
      },
    });
  }

  private handleAddMilestoneWindowAdd(milestone: IMilestone) {
    this.actionManager.execute(new AddMilestoneAction(milestone, this.application));
    this.windowController.closeWindow(this.addMilestoneWindow);
  }

  private handleAddMilestoneWindowCloseRequest() {
    this.windowController.closeWindow(this.addMilestoneWindow);
  }

  private handleEditMilestoneWindowUpdate(milestone: IMilestone, milestoneChange: IMilestoneChange) {
    this.actionManager.execute(new UpdateMilestoneAction(milestone, milestoneChange, this.application));
    this.windowController.closeWindow(this.editMilestoneWindow);
  }

  private handleEditMilestoneWindowCloseRequest() {
    this.windowController.closeWindow(this.editMilestoneWindow);
  }

  render() {
    return (
      <div className="milestone-controller-component">
      </div>
    );
  }
};
