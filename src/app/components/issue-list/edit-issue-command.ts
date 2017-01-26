import { IIssue } from '../../application';
import { BaseCommand } from '../../commands';
import { IIssueController } from '../../issues';
import { KeyCode } from '../../keyboard';

export default class EditIssueCommand extends BaseCommand {
  constructor(private issue: IIssue, private issueController: IIssueController) {
    super();
  }

  get id() {
    return `edit-issue-${this.issue.id}`;
  }

  get name() {
    return 'Edit Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.Enter }];
  }

  execute() {
    this.issueController.editIssue(this.issue);
  }
}
