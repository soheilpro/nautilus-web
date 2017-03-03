import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class LoadConfigurationCommand extends BaseCommand {
  constructor(private onExecute: () => void) {
    super();
  }

  get id() {
    return 'load-configuration';
  }

  get name() {
    return 'Configuration: Load';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.L },
    ];
  }

  execute() {
    this.onExecute();
  }
}
