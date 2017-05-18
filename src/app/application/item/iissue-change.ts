import { IEntity } from '../../sdk';

export interface IIssueChange {
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];
  project?: IEntity;
  milestone?: IEntity;
  assignedTo?: IEntity;
}
