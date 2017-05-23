import { browserHistory } from 'react-router';
import { BaseCommand } from '../../commands';
import { KeyCode } from '../../keyboard';

export default class ViewMilestonesCommand extends BaseCommand {
  get id() {
    return 'view-milestones';
  }

  get title() {
    return 'View Milestones';
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
