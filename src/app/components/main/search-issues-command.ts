import { IActionManager } from '../../actions';
import { IApplication } from '../../application';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';
import Main from './index';

export default class SearchIssuesCommand extends BaseCommand {
  constructor(private main: Main) {
    super();
  }

  get id() {
    return 'search-issues';
  }

  get name() {
    return 'Search Issues';
  }

  get shortcuts() {
    return [
      [{ keyCode: KeyCode.S }]
    ];
  }

  execute() {
    this.main.setState({
      isSearchModalOpen: true,
    });
  }
}
