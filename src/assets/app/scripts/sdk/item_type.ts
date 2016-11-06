import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItemType extends IEntity {
  title?: string;
  key?: string;
  order?: number;
}

export interface IItemTypeFilter extends IFilter {
}

export interface IItemTypeChange extends IChange {
  title?: string;
  key?: string;
  order?: number;
}

export interface IItemTypeService extends IService<IItemType, IItemTypeFilter, IItemTypeChange> {
}

export class ItemTypeService extends BaseService<IItemType, IItemTypeFilter, IItemTypeChange> implements IItemTypeService {
  basePath(): string {
    return "/itemtypes";
  }

  filterToParams(filter: IItemTypeFilter): Object {
    return undefined;
  }

  entityToParams(entity: IItemType): Object {
    return {
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