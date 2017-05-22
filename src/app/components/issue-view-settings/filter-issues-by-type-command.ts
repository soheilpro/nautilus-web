import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssuesByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-type-filter';
  }

  get title() {
    return 'Filter Issues by Type';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.I },
      { keyCode: KeyCode.T },
    ];
  }

  execute() {
    this.onExecute();
  }
}
