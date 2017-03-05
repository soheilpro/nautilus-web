import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterTaskByTypeCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'task-type-filter';
  }

  get name() {
    return 'Filter: Tasks Type';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.T },
      { keyCode: KeyCode.T },
    ];
  }

  execute() {
    this.onExecute();
  }
}
