import { browserHistory } from 'react-router';
import { IActionManager } from '../../actions';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class UndoCommand extends BaseCommand {
  constructor(private actionManager: IActionManager) {
    super();
  }

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
