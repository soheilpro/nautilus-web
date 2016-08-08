import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItemArea extends IEntity {
  title?: string;
  project?: IEntity;
}

export interface IItemAreaFilter extends IFilter {
}

export interface IItemAreaChange extends IChange {
  title?: string;
  project?: IEntity;
}

export interface IItemAreaService extends IService<IItemArea, IItemAreaFilter, IItemAreaChange> {
}

export class ItemAreaService extends BaseService<IItemArea, IItemAreaFilter, IItemAreaChange> implements IItemAreaService {
  basePath(): string {
    return "/itemareas";
  }

  filterToParams(filter: IItemAreaFilter): Object {
    return undefined;
  }

  entityToParams(entity: IItemArea): Object {
    return {
      title: entity.title,
      project_id: this.toId(entity.project)
    };
  }

  changeToParams(change: IItemAreaChange): Object {
    return {
      title: change.title,
      project_id: this.toId(change.project)
    };
  }
}