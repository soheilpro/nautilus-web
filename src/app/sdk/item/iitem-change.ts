import { IEntity } from '../ientity';
import { IChange } from '../ichange';

export interface IItemChange extends IChange {
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];
  project?: IEntity;
  parent?: IEntity;
  assignedTo?: IEntity;
}
