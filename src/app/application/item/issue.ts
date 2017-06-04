import { IItem, IItemType, IItemState, IItemPriority, IProject, IUser } from '../../sdk';
import { IApplication } from '../iapplication';
import { IIssue } from './iissue';
import { IMilestone } from './imilestone';

export default class Issue implements IIssue {
  private _type: IItemType;
  private _state: IItemState;
  private _priority: IItemPriority;
  private _project: IProject;
  private _assignedTo: IUser;
  private _createdBy: IUser;
  private _modifiedBy: IUser;
  private _parent: IIssue;
  private _milestone: IMilestone;

  constructor(private item: IItem, private application: IApplication) {
  }

  get id() {
    return this.item.id;
  }

  get sid() {
    return this.item.sid;
  }

  get type() {
    if (this._type === undefined)
      this._type = this.application.itemTypes.get(this.item.type) || null;

    return this._type;
  }

  get title() {
    return this.item.title;
  }

  get description() {
    return this.item.description;
  }

  get state() {
    if (this._state === undefined)
      this._state = this.application.itemStates.get(this.item.state) || null;

    return this._state;
  }

  get priority() {
    if (this._priority === undefined)
      this._priority = this.application.itemPriorities.get(this.item.priority) || null;

    return this._priority;
  }

  get tags() {
    return this.item.tags;
  }

  get project() {
    if (this._project === undefined)
      this._project =  this.application.projects.get(this.item.project) || null;

    return this._project;
  }

  get assignedTo() {
    if (this._assignedTo === undefined)
      this._assignedTo = this.application.users.get(this.item.assignedTo) || null;

    return this._assignedTo;
  }

  get createdBy() {
    if (this._createdBy === undefined)
      this._createdBy = this.application.users.get(this.item.createdBy) || null;

    return this._createdBy;
  }

  get modifiedBy() {
    if (this._modifiedBy === undefined)
      this._modifiedBy = this.application.users.get(this.item.modifiedBy) || null;

    return this._modifiedBy;
  }

  get parent() {
    if (this._parent === undefined)
      this._parent = this.application.items.getIssueParent(this.item) || null;

    return this._parent;
  }

  get milestone() {
    if (this._milestone === undefined)
      this._milestone = this.application.items.getIssueMilestone(this.item) || null;

    return this._milestone;
  }

  toJSON() {
    return {
      id: this.id,
      sid: this.sid,
      type: this.type,
      title: this.title,
      description: this.description,
      state: this.state,
      priority: this.priority,
      tags: this.tags,
      project: this.project,
      assignedTo: this.assignedTo,
      createdBy: this.createdBy,
      modifiedBy: this.modifiedBy,
      parent: this.parent,
      milestone: this.milestone,
    };
  }
}
