import { IService } from '../iservice';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityFilter } from './iitem-priority-filter';
import { IItemPriorityChange } from './iitem-priority-change';

export interface IItemPriorityService extends IService<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}
