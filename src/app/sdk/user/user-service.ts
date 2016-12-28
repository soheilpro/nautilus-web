import { ServiceBase } from '../service-base';
import { IUser } from './iuser';
import { IUserService } from './iuser-service';
import { IUserFilter } from './iuser-filter';
import { IUserChange } from './iuser-change';
import { IUserPermission } from './iuser-permission';

export class UserService extends ServiceBase<IUser, IUserFilter, IUserChange> implements IUserService {
  basePath(): string {
    return '/users';
  }

  filterToParams(filter: IUserFilter): Object {
    return {
      username: filter.username
    };
  }

  entityToParams(entity: IUser): Object {
    return {
      username: entity.username,
      name: entity.name,
      email: entity.email
    };
  }

  changeToParams(change: IUserChange): Object {
    return {
      username: change.username,
      name: change.name,
      email: change.email
    };
  }

  getUserPermissions(user: IUser): Promise<IUserPermission[]> {
    let options = {
      method: 'GET',
      path: `${this.basePath()}/${user.id}/permissions`
    };

    return this.invoke(options);
  }
}
