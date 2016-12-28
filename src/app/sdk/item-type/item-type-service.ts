import { ServiceBase } from '../service-base';
import { IItemType } from './iitem-type';
import { IItemTypeChange } from './iitem-type-change';
import { IItemTypeFilter } from './iitem-type-filter';
import { IItemTypeService } from './iitem-type-service';

export class ItemTypeService extends ServiceBase<IItemType, IItemTypeFilter, IItemTypeChange> implements IItemTypeService {
  basePath(): string {
    return '/itemtypes';
  }

  filterToParams(filter: IItemTypeFilter): Object {
    return undefined;
  }

  entityToParams(entity: IItemType): Object {
    return {
      itemKind: entity.itemKind,
      title: entity.title,
      key: entity.key,
      order: entity.order
    };
  }

  changeToParams(change: IItemTypeChange): Object {
    return {
      title: change.title,
      key: change.key,
      order: change.order
    };
  }
}
