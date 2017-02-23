import { IModule } from '../imodule';
import { IItemPriority } from '../../sdk';

export interface IItemPriorityModule extends IModule {
  getAll(itemKind: string): IItemPriority[];
  get(ItemPriority: IItemPriority): IItemPriority;
}
