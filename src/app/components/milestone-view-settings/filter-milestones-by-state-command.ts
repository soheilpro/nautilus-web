import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class FiltersMilestoneByStateCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'milestone-state-filter';
  }

  get title() {
    return 'Filter Milestones by State';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.M },
      { keyCode: KeyCode.S },
    ];
  }

  execute() {
    this.onExecute();
  }
}
