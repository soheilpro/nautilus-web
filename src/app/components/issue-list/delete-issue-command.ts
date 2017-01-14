import { IIssue } from '../../application';
import { BaseCommand } from '../../commands';
import { IIssueController } from '../../issues';
import { KeyCode } from '../../keyboard';

export default class DeleteIssueCommand extends BaseCommand {
  constructor(private issue: IIssue, private issueController: IIssueController) {
    super();
  }

  get id() {
    return `delete-issue-${this.issue.id}`;
  }

  get name() {
    return 'Delete Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.Delete }];
  }

  execute() {
    this.issueController.deleteIssue(this.issue);
  }
}
