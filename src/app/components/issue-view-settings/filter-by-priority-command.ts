import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssuesByPriorityCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-priority-filter';
  }

  get title() {
    return 'Filter by Priority';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.B },
      { keyCode: KeyCode.R },
    ];
  }

  execute() {
    this.onExecute();
  }
}
