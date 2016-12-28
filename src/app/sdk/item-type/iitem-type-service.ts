import { IService } from '../iservice';
import { IItemType } from './iitem-type';
import { IItemTypeChange } from './iitem-type-change';
import { IItemTypeFilter } from './iitem-type-filter';

export interface IItemTypeService extends IService<IItemType, IItemTypeFilter, IItemTypeChange> {
}
