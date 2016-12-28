import { ServiceBase } from '../service-base';
import { IProject } from './iproject';
import { IProjectChange } from './iproject-change';
import { IProjectFilter } from './iproject-filter';
import { IProjectService } from './iproject-service';

export class ProjectService extends ServiceBase<IProject, IProjectFilter, IProjectChange> implements IProjectService {
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
