import { IAction } from './iaction';
import { IActionManager } from './iaction-manager';

export class ActionManager implements IActionManager {
  private actions: IAction[] = [];

  getActions() {
    return this.actions;
  }

  execute(action: IAction) {
    action.execute();
    this.actions.push(action);
  }

  undo(): void {
    const lastAction = this.actions.pop();
    lastAction.undo();
  }
}
