import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class UndoLastActionCommand extends BaseCommand {
  private actionManager = ServiceManager.Instance.getActionManager();

  get id() {
    return 'undo-last-action';
  }

  get title() {
    return 'Undo';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.Z }];
  }

  get enabled() {
    return this.actionManager.getActions().length > 0;
  }

  async execute() {
    await this.actionManager.undo();
  }
}
