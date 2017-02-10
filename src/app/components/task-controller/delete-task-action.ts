import { BaseAction } from '../../actions';
import { IApplication, ITask } from '../../application';

export default class AddTaskAction extends BaseAction {
  constructor(private task: ITask, private application: IApplication) {
    super();
  }

  async execute() {
    this.application.items.deleteTask(this.task);
  }

  undo() {
  }
}
