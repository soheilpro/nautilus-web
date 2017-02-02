import { BaseAction } from '../../actions';
import { IApplication, ITask, ITaskChange } from '../../application';

export default class UpdateTaskAction extends BaseAction {
  constructor(private task: ITask, private taskChange: ITaskChange, private application: IApplication) {
    super();
  }

  async execute() {
    this.task = await this.application.tasks.update(this.task.id, this.taskChange);
  }

  undo() {
  }
}
