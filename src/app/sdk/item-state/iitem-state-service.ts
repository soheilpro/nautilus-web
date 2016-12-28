import { IService } from '../iservice';
import { IItemState } from './iitem-state';
import { IItemStateChange } from './iitem-state-change';
import { IItemStateFilter } from './iitem-state-filter';

export interface IItemStateService extends IService<IItemState, IItemStateFilter, IItemStateChange> {
}
