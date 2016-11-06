import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItemPriority extends IEntity {
  title?: string;
  key?: string;
  order?: number;
}

export interface IItemPriorityFilter extends IFilter {
}

export interface IItemPriorityChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}

export interface IItemPriorityService extends IService<IItemPriority, IItemPriorityFilter, IItemPriorityChange> {
}

export class ItemPriorityService extends BaseService<IItemPriority, IItemPriorityFilter, IItemPriorityChange> implements IItemPriorityService {
  basePath(): string {
    return "/itempriorities";
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