import { IItem, IItemState, IProject, IUser } from '../../sdk';
import { IApplication } from '../iapplication';
import { IMilestone } from './imilestone';

export default class Milestone implements IMilestone {
  private _state: IItemState;
  private _project: IProject;
  private _createdBy: IUser;
  private _modifiedBy: IUser;
  private _parent: IMilestone;

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

    return `(Global) ${this.title}`;
  }

  get description() {
    return this.item.description;
  }

  get state() {
    if (this._state === undefined)
      this._state = this.application.itemStates.get(this.item.state) || null;

    return this._state;
  }

  get project() {
    if (this._project === undefined)
      this._project =  this.application.projects.get(this.item.project) || null;

    return this._project;
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
      this._parent = this.application.items.getMilestoneParent(this.item) || null;

    return this._parent;
  }

  toJSON() {
    return {
      id: this.id,
      sid: this.sid,
      title: this.title,
      fullTitle: this.fullTitle,
      description: this.description,
      state: this.state,
      project: this.project,
      parent: this.parent,
      createdBy: this.createdBy,
      modifiedBy: this.modifiedBy,
    };
  }
}
