import { browserHistory } from 'react-router';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class GoToIssuesCommand extends BaseCommand {
  get id() {
    return 'go-to-issues';
  }

  get title() {
    return 'Go to Issues';
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
