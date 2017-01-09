import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class SearchCommand extends BaseCommand {
  constructor(private onExecute: Function) {
    super();
  }

  get id() {
    return 'search';
  }

  get name() {
    return 'Search';
  }

  get shortcuts() {
    return [
      [{ keyCode: KeyCode.S }]
    ];
  }

  execute() {
    this.onExecute();
  }
}
