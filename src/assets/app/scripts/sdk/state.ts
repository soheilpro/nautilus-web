import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IState extends IEntity {
  title?: string;
  type?: string;
  color?: string;
}

export interface IStateFilter extends IFilter {
}

export interface IStateChange extends IChange {
  title?: string;
  type?: string;
  color?: string;
}

export interface IStateService extends IService<IState, IStateFilter, IStateChange> {
}

export class StateService extends BaseService<IState, IStateFilter, IStateChange> implements IStateService {
  basePath(): string {
    return "/states";
  }

  filterToParams(filter: IStateFilter): Object {
    return undefined;
  }

  entityToParams(entity: IState): Object {
    return {
      title: entity.title,
      type: entity.type,
      color: entity.color
    };
  }

  changeToParams(change: IStateChange): Object {
    return {
      title: change.title,
      type: change.type,
      color: change.color
    };
  }
}