import { ServiceBase } from '../service-base';
import { IItemPriority } from './iitem-priority';
import { IItemPriorityService } from './iitem-priority-service';
import { IItemPriorityFilter } from './iitem-priority-filter';
import { IItemPriorityChange } from './iitem-priority-change';

export class ItemPriorityService extends ServiceBase<IItemPriority, IItemPriorityFilter, IItemPriorityChange> implements IItemPriorityService {
  basePath(): string {
    return '/itempriorities';
  }

  filterToParams(filter: IItemPriorityFilter): Object {
    return undefined;
  }

  entityToParams(entity: IItemPriority): Object {
    return {
      title: entity.title,
      key: entity.key,
      order: entity.order
    };
  }

  changeToParams(change: IItemPriorityChange): Object {
    return {
      title: change.title,
      key: change.key,
      order: change.order
    };
  }
}
