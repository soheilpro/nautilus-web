import { BaseAction } from '../../actions';
import { IApplication, ITask, IIssue } from '../../application';

export default class AddTaskAction extends BaseAction {
  constructor(private task: ITask, private issue: IIssue, private application: IApplication) {
    super();
  }

  async execute() {
    this.task = await this.application.items.addTask(this.task, this.issue);
  }

  undo() {
    this.application.items.deleteTask(this.task);
  }
}
