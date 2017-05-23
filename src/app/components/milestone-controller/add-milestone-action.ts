import { BaseAction } from '../../actions';
import { IApplication, IMilestone } from '../../application';

export default class AddMilestoneAction extends BaseAction {
  constructor(private milestone: IMilestone, private application: IApplication) {
    super();
  }

  async execute() {
    this.milestone = await this.application.items.addMilestone(this.milestone);
  }

  undo() {
    this.application.items.deleteMilestone(this.milestone);
  }
}
