import { browserHistory } from 'react-router';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class ViewIssuesCommand extends BaseCommand {
  get id() {
    return 'view-issues';
  }

  get name() {
    return 'View Issues';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.I }
    ];
  }

  execute() {
    browserHistory.push('/');
  }
}
