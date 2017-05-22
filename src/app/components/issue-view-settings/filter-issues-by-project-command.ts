import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterIssuesByProjectCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'issue-project-filter';
  }

  get title() {
    return 'Filter Issues by Project';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.I },
      { keyCode: KeyCode.P },
    ];
  }

  execute() {
    this.onExecute();
  }
}
