import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class ResetConfigurationCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'reset-configuration';
  }

  get name() {
    return 'Filters: Reset';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.F },
      { keyCode: KeyCode.R },
    ];
  }

  execute() {
    this.onExecute();
  }
}
