import { BaseAction } from '../../actions';
import { IApplication, IMilestone } from '../../application';

export default class AddMilestoneAction extends BaseAction {
  constructor(private milestone: IMilestone, private application: IApplication) {
    super();
  }

  async execute() {
    this.application.items.deleteMilestone(this.milestone);
  }

  undo() {
  }
}
