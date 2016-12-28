import { IService } from '../iservice';
import { IItem } from './iitem';
import { IItemChange } from './iitem-change';
import { IItemFilter } from './iitem-filter';

export interface IItemService extends IService<IItem, IItemFilter, IItemChange> {
}
