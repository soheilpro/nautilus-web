import { IService } from '../iservice';
import { IItemType } from './iitem-type';
import { IItemTypeFilter } from './iitem-type-filter';
import { IItemTypeChange } from './iitem-type-change';

export interface IItemTypeService extends IService<IItemType, IItemTypeFilter, IItemTypeChange> {
}
