import { IService } from '../iservice';
import { IItem } from './iitem';
import { IItemFilter } from './iitem-filter';
import { IItemChange } from './iitem-change';

export interface IItemService extends IService<IItem, IItemFilter, IItemChange> {
}
