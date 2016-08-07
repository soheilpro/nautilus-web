import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IUser extends IEntity {
  username?: string;
  name?: string;
}

export interface IUserFilter extends IFilter {
  username?: string;
}

export interface IUserChange extends IChange {
  username?: string;
  name?: string;
}

export interface IUserService extends IService<IUser, IUserFilter, IUserChange> {
}

export class UserService extends BaseService<IUser, IUserFilter, IUserChange> implements IUserService {
  basePath(): string {
    return "/users";
  }

  filterToParams(filter: IUserFilter): Object {
    return {
      username: filter.username
    };
  }

  entityToParams(entity: IUser): Object {
    return {
      username: entity.username,
      name: entity.name
    };
  }

  changeToParams(change: IUserChange): Object {
    return {
      username: change.username,
      name: change.name
    };
  }
}