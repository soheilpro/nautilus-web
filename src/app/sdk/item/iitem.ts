import { IEntity } from '../ientity';

export interface IItem extends IEntity {
  sid?: string;
  kind?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];
  project?: IEntity;
  parent?: IEntity;
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;
}