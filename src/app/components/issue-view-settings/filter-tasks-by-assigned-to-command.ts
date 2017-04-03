import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterTaskByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'task-assigned-to-filter';
  }

  get title() {
    return 'Filter Tasks by Assigned To';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.T },
      { keyCode: KeyCode.A },
    ];
  }

  execute() {
    this.onExecute();
  }
}
