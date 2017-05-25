import { BaseAction } from '../../actions';
import { IApplication, IIssue } from '../../application';

export default class DeleteIssueAction extends BaseAction {
  constructor(private issue: IIssue, private application: IApplication) {
    super();
  }

  execute() {
    this.application.items.deleteIssue(this.issue);
  }

  undo() {
  }
}
