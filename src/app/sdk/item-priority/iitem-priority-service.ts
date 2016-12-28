import { IService } from '../iservice';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityChange } from './iitem-priority-change';
import { IItemPriorityFilter } from './iitem-priority-filter';

export interface IItemPriorityService extends IService<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}
