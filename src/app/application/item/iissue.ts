import { IEntity, IItemType, IItemState, IItemPriority, IProject, IUser } from '../../sdk';
import { IMilestone } from './imilestone';
import { IIssue } from './iissue';

export interface IIssue extends IEntity {
  sid?: string;
  type?: IItemType;
  title?: string;
  description?: string;
  state?: IItemState;
  priority?: IItemPriority;
  tags?: string[];
  project?: IProject;
  parent?: IIssue;
  milestone?: IMilestone;
  assignedTo?: IUser;
  createdBy?: IUser;
  modifiedBy?: IUser;
}
