import { IIssue } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class NewTaskCommand extends BaseCommand {
  private taskController = ServiceManager.Instance.getTaskController();

  constructor(private issue: IIssue) {
    super();
  }

  get id() {
    return 'new-task';
  }

  get name() {
    return 'New Task';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.T }];
  }

  execute() {
    this.taskController.addTask(this.issue);
  }
}
