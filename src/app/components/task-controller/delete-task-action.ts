import { BaseAction } from '../../actions';
import { IApplication, ITask } from '../../application';

export default class AddTaskAction extends BaseAction {
  constructor(private task: ITask, private application: IApplication) {
    super();
  }

  async execute() {
    this.application.tasks.delete(this.task);
  }

  undo() {
  }
}
