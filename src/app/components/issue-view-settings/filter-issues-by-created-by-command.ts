import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssueByCreatedByCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-created-by-filter';
  }

  get title() {
    return 'Filter Issues by Created By';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.I },
      { keyCode: KeyCode.C },
    ];
  }

  execute() {
    this.onExecute();
  }
}
