import { IModule } from '../imodule';
import { IItemType } from '../../sdk';

export interface IItemTypeModule extends IModule {
  getAll(itemKind: string): IItemType[];
  get(ItemType: IItemType): IItemType;
}
