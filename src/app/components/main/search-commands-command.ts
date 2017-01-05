import { IActionManager } from '../../actions';
import { IApplication } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import Main from './index';

export default class SearchCommandsCommand extends BaseCommand {
  constructor(private main: Main) {
    super();
  }

  get id() {
    return 'search-commands';
  }

  get name() {
    return 'Search Commands';
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
    this.main.setState({
      isCommandsModalOpen: true,
    });
  }
}
