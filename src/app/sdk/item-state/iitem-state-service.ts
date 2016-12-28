import { IService } from '../iservice';
import { IItemState } from './iitem-state';
import { IItemStateFilter } from './iitem-state-filter';
import { IItemStateChange } from './iitem-state-change';

export interface IItemStateService extends IService<IItemState, IItemStateFilter, IItemStateChange> {
}
