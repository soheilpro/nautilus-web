import { IModule } from '../imodule';
import { IItemPriority } from '../../sdk';

export interface IItemPriorityModule extends IModule {
  getAll(): IItemPriority[];
  getAllIssuePriorities(): IItemPriority[];
  getAllTaskPriorities(): IItemPriority[];
  get(ItemPriority: IItemPriority): IItemPriority;
}
