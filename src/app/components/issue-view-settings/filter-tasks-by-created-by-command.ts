import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterTaskByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'task-created-by-filter';
  }

  get title() {
    return 'Filter Tasks by Created By';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.T },
      { keyCode: KeyCode.C },
    ];
  }

  execute() {
    this.onExecute();
  }
}
