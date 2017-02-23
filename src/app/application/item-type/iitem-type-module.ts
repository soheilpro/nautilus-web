import { IModule } from '../imodule';
import { IItemType } from '../../sdk';
import { ItemKind } from '../item-kind';

export interface IItemTypeModule extends IModule {
  getAll(itemKind: ItemKind): IItemType[];
  get(ItemType: IItemType): IItemType;
}
