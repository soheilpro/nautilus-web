import { IItem } from '../../sdk';
import { IApplication } from '../iapplication';
import { IIssue } from './iissue';

export default class Issue implements IIssue {
  constructor(private item: IItem, private application: IApplication) {
  }

  get id() {
    return this.item.id;
  }

  get sid() {
    return this.item.sid;
  }

  get type() {
    if (!this.item.type)
      return null;

    return this.application.itemTypes.get(this.item.type);
  }

  get title() {
    return this.item.title;
  }

  get description() {
    return this.item.description;
  }

  get state() {
    if (!this.item.state)
      return null;

    return this.application.itemStates.get(this.item.state);
  }

  get priority() {
    if (!this.item.priority)
      return null;

    return this.application.itemPriorities.get(this.item.priority);
  }

  get tags() {
    return this.item.tags;
  }

  get project() {
    if (!this.item.project)
      return null;

    return this.application.projects.get(this.item.project);
  }

  get parentIssue() {
    return null as IIssue;
  }

  get milestone() {
    return this.application.items.getMilestone(this.item.parent);
  }

  get assignedTo() {
    if (!this.item.assignedTo)
      return null;

    return this.application.users.get(this.item.assignedTo);
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
