import { ITask } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class EditTaskCommand extends BaseCommand {
  private taskController = ServiceManager.Instance.getTaskController();

  constructor(private task: ITask) {
    super();
  }

  get id() {
    return 'edit-task';
  }

  get name() {
    return 'Edit Task';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.Enter }];
  }

  get enabled() {
    return !!this.task;
  }

  execute() {
    this.taskController.editTask(this.task);
  }
}