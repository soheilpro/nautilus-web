import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItemState extends IEntity {
  itemKind?: string;
  title?: string;
  key?: string;
  order?: number;
}

export interface IItemStateFilter extends IFilter {
}

export interface IItemStateChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}

export interface IItemStateService extends IService<IItemState, IItemStateFilter, IItemStateChange> {
}

export class ItemStateService extends BaseService<IItemState, IItemStateFilter, IItemStateChange> implements IItemStateService {
  basePath(): string {
    return "/itemstates";
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