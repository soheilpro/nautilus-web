import { BaseAction } from '../../actions';
import { IApplication, ITask, IIssue } from '../../application';

export default class AddTaskAction extends BaseAction {
  constructor(private task: ITask, private issue: IIssue, private application: IApplication) {
    super();
  }

  async execute() {
    this.task = await this.application.tasks.add(this.task, this.issue);
  }

  undo() {
    this.application.tasks.delete(this.task);
  }
}
