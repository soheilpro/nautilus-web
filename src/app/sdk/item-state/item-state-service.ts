import { ServiceBase } from '../service-base';
import { IItemState } from './iitem-state';
import { IItemStateChange } from './iitem-state-change';
import { IItemStateFilter } from './iitem-state-filter';
import { IItemStateService } from './iitem-state-service';

export class ItemStateService extends ServiceBase<IItemState, IItemStateFilter, IItemStateChange> implements IItemStateService {
  basePath(): string {
    return '/itemstates';
  }

  filterToParams(filter: IItemStateFilter): Object {
    return undefined;
  }

  entityToParams(entity: IItemState): Object {
    return {
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order
    };
  }

  changeToParams(change: IItemStateChange): Object {
    return {
      title: change.title,
      key: change.key,
      order: change.order
    };
  }
}
