import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssueByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'clear-filters';
  }

  get name() {
    return 'Clear Filters';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.C },
    ];
  }

  execute() {
    this.onExecute();
  }
}
