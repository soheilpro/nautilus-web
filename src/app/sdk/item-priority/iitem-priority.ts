import { IEntity } from '../ientity';

export interface IItemPriority extends IEntity {
  title?: string;
  key?: string;
  order?: number;
}
