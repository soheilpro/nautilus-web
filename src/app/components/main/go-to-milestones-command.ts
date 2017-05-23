import { browserHistory } from 'react-router';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class GoToMilestonesCommand extends BaseCommand {
  get id() {
    return 'go-to-milestones';
  }

  get title() {
    return 'Go to Milestones';
  }

  get shortcut() {
    return [
      { keyCode: KeyCode.G },
      { keyCode: KeyCode.M }
    ];
  }

  execute() {
    browserHistory.push('/milestones');
  }
}
