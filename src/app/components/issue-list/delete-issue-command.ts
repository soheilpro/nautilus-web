import { IIssue } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class DeleteIssueCommand extends BaseCommand {
  private issueController = ServiceManager.Instance.getIssueController();

  constructor(private issue: IIssue) {
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
