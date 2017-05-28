import { BaseAction } from '../../actions';
import { IApplication, IIssue } from '../../application';

export default class AddIssueAction extends BaseAction {
  constructor(private issue: IIssue, private application: IApplication) {
    super();
  }

  async execute() {
    this.issue = await this.application.items.addIssue(this.issue);
  }

  async undo() {
    await this.application.items.deleteIssue(this.issue);
  }
}
