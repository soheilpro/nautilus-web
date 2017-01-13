import { IIssueController } from '../issues';
import { IControllerManager } from './icontroller-manager';

export class ControllerManager implements IControllerManager {
  private issueController: IIssueController;

  setIssueController(issueController: IIssueController) {
    this.issueController = issueController;
  }

  getIssueController() {
    return this.issueController;
  }
}
