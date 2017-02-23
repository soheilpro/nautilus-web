import { IModule } from '../imodule';
import { IItemState } from '../../sdk';
import { ItemKind } from '../item-kind';

export interface IItemStateModule extends IModule {
  getAll(itemKind: ItemKind): IItemState[];
  get(ItemState: IItemState): IItemState;
}
