import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IProject extends IEntity {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface IProjectFilter extends IFilter {
}

export interface IProjectChange extends IChange {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface IProjectService extends IService<IProject, IProjectFilter, IProjectChange> {
}

export class ProjectService extends BaseService<IProject, IProjectFilter, IProjectChange> implements IProjectService {
  basePath(): string {
    return '/projects';
  }

  filterToParams(filter: IProjectFilter): Object {
    return undefined;
  }

  entityToParams(entity: IProject): Object {
    return {
      name: entity.name,
      description: entity.description,
      tags: entity.tags ? entity.tags.join(' ') : undefined
    };
  }

  changeToParams(change: IProjectChange): Object {
    return {
      name: change.name,
      description: change.description,
      tags: change.tags ? change.tags.join(' ') : undefined
    };
  }
}
