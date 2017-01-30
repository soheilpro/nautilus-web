import { IIssue } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class EditIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(private issue: IIssue) {
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
