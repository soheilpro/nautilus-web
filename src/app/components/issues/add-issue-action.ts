import { BaseAction } from '../../actions';
import { IApplication, IIssue } from '../../application';

export default class AddIssueAction extends BaseAction {
  private issue: IIssue;

  constructor(private application: IApplication) {
    super();
  }

  async execute() {
    this.issue = await this.application.issues.add({});
  }

  undo() {
    this.application.issues.delete(this.issue);
  }
}
