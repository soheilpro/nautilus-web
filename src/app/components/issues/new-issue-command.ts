import { IActionManager } from '../../actions';
import { IApplication } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import AddIssueAction from './add-issue-action';

export default class NewIssueCommand extends BaseCommand {
  constructor(private actionManager: IActionManager, private application: IApplication) {
    super();
  }

  get id() {
    return 'new-issue';
  }

  get name() {
    return 'New Issue';
  }

  get shortcuts() {
    return [
      [{ keyCode: KeyCode.N }]
    ];
  }

  execute() {
    let action = new AddIssueAction(this.application);
    this.actionManager.execute(action);
  }
}
