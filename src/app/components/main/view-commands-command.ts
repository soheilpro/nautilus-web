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

  get shortcuts() {
    return [
      [{ keyCode: KeyCode.P }]
    ];
  }

  get isHidden() {
    return true;
  }

  execute() {
    this.onExecute();
  }
}
