import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';

export default class UndoCommand extends BaseCommand {
  private actionManager = ServiceManager.Instance.getActionManager();

  get id() {
    return 'undo';
  }

  get name() {
    return 'Undo';
  }

  get shortcut() {
    return [{ keyCode: KeyCode.Z }];
  }

  get isDisabled() {
    return this.actionManager.getActions().length === 0;
  }

  execute() {
    this.actionManager.undo();
  }
}
