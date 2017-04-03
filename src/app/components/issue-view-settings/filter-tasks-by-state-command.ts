import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FilterTaskByStateCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'task-state-filter';
  }

  get title() {
    return 'Filter Tasks by State';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.T },
      { keyCode: KeyCode.S },
    ];
  }

  execute() {
    this.onExecute();
  }
}
