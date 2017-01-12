import { BaseAction } from '../../actions';
import { IApplication, IIssue } from '../../application';

export default class AddIssueAction extends BaseAction {
  constructor(private issue: IIssue, private application: IApplication) {
    super();
  }

  async execute() {
    this.issue = await this.application.issues.add(this.issue);
  }

  undo() {
    this.application.issues.delete(this.issue);
  }
}
