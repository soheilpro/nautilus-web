import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { IConfiguration } from './iconfiguration';

export default class SaveConfigurationCommand extends BaseCommand {
  constructor(private configuration: IConfiguration, private onExecute: () => void) {
    super();
  }

  get id() {
    return 'save-configuration';
  }

  get name() {
    return 'Configuration: Save';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.V },
      { keyCode: KeyCode.S },
    ];
  }

  get enabled() {
    return !this.configuration.isEmpty();
  }

  execute() {
    this.onExecute();
  }
}
