import { IItem } from '../../sdk';
import { IApplication } from '../iapplication';
import { IMilestone } from './imilestone';

export default class Milestone implements IMilestone {
  constructor(private item: IItem, private application: IApplication) {
  }

  get id() {
    return this.item.id;
  }

  get sid() {
    return this.item.sid;
  }

  get title() {
    return this.item.title;
  }

  get fullTitle() {
    const project = this.project;

    if (project)
      return `${project.name}: ${this.title}`;

    return this.title;
  }

  get description() {
    return this.item.description;
  }

  get state() {
    if (!this.item.state)
      return null;

    return this.application.itemStates.get(this.item.state);
  }

  get project() {
    if (!this.item.project)
      return null;

    return this.application.projects.get(this.item.project);
  }

  get parentMilestone() {
    return null as IMilestone;
  }

  get createdBy() {
    if (!this.item.createdBy)
      return null;

    return this.application.users.get(this.item.createdBy);
  }

  get modifiedBy() {
    if (!this.item.modifiedBy)
      return null;

    return this.application.users.get(this.item.modifiedBy);
  }
}
