import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class NewIssueCommand extends BaseCommand {
  constructor(private onExecute: Function) {
    super();
  }

  get id() {
    return 'new-issue';
  }

  get name() {
    return 'New Issue';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.N }];
  }

  execute() {
    this.onExecute();
  }
}
