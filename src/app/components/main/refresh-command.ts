import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class RefreshCommand extends BaseCommand {
  private application = ServiceManager.Instance.getApplication();

  get id() {
    return 'refresh';
  }

  get title() {
    return 'Refresh';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.R }];
  }

  execute() {
    this.application.load();
  }
}
