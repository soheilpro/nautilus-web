import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItemState extends IEntity {
  title?: string;
  type?: string;
  color?: string;
}

export interface IItemStateFilter extends IFilter {
}

export interface IItemStateChange extends IChange {
  title?: string;
  type?: string;
  color?: string;
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
      title: entity.title,
      type: entity.type,
      color: entity.color
    };
  }

  changeToParams(change: IItemStateChange): Object {
    return {
      title: change.title,
      type: change.type,
      color: change.color
    };
  }
}