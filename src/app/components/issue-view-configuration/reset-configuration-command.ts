import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { IConfiguration } from './iconfiguration';

export default class ResetConfigurationCommand extends BaseCommand {
  constructor(private configuration: IConfiguration, private onExecute: () => void) {
    super();
  }

  get id() {
    return 'reset-configuration';
  }

  get name() {
    return 'Configuration: Reset';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.R },
    ];
  }

  get enabled() {
    return !this.configuration.isEmpty();
  }

  execute() {
    this.onExecute();
  }
}
