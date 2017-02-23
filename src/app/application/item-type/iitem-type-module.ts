import { IModule } from '../imodule';
import { IItemType } from '../../sdk';

export interface IItemTypeModule extends IModule {
  getAll(): IItemType[];
  getAllIssueTypes(): IItemType[];
  getAllTaskTypes(): IItemType[];
  get(ItemType: IItemType): IItemType;
}
