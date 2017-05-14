import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssuesByAssignedToCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-assigned-to-filter';
  }

  get title() {
    return 'Filter Issues by Assigned To';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.I },
      { keyCode: KeyCode.A },
    ];
  }

  execute() {
    this.onExecute();
  }
}
