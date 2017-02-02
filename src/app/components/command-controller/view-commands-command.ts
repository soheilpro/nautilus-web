import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class ViewCommandsCommand extends BaseCommand {
  private commandController = ServiceManager.Instance.getCommandController();

  get id() {
    return 'view-commands';
  }

  get name() {
    return 'View Commands';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.P }];
  }

  get visible() {
    return false;
  }

  execute() {
    this.commandController.showCommandsWindow();
  }
}
