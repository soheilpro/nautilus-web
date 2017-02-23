import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssueByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'filter-issues-by-type';
  }

  get name() {
    return 'Filter Issues by Type';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.T },
    ];
  }

  execute() {
    this.onExecute();
  }
}
