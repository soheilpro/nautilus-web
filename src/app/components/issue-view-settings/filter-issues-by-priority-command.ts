import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssueByPriorityCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-priority-filter';
  }

  get title() {
    return 'Filter Issues by Priority';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.I },
      { keyCode: KeyCode.R },
    ];
  }

  execute() {
    this.onExecute();
  }
}
