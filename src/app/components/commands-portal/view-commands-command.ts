import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class ViewCommandsCommand extends BaseCommand {
  constructor(private onExecute: Function) {
    super();
  }

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
    this.onExecute();
  }
}
