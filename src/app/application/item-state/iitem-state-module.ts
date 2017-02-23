import { IModule } from '../imodule';
import { IItemState } from '../../sdk';

export interface IItemStateModule extends IModule {
  getAll(): IItemState[];
  getAllIssueStates(): IItemState[];
  getAllTaskStates(): IItemState[];
  get(ItemState: IItemState): IItemState;
}
