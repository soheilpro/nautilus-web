import { IModule } from '../imodule';
import { IItemState } from '../../sdk';

export interface IItemStateModule extends IModule {
  getAll(itemKind: string): IItemState[];
  get(ItemState: IItemState): IItemState;
}
