import { IEntity, IFilter, IChange, IService, IInsertCallback, BaseService } from './base';
import { IUser } from './user';

export interface ISession extends IEntity {
  user: IUser;
}

export interface ISessionFilter extends IFilter {
}

export interface ISessionChange extends IChange {
}

export interface ISessionService extends IService<ISession, ISessionFilter, ISessionChange> {
  login(username: string, password: string, callback: IInsertCallback<ISession>): void;
}

export class SessionService extends BaseService<ISession, ISessionFilter, ISessionChange> implements ISessionService {
  basePath(): string {
    return "/sessions";
  }

  filterToParams(filter: ISessionFilter): Object {
    return undefined;
  }

  entityToParams(entity: ISession): Object {
    return undefined;
  }

  changeToParams(change: ISessionChange): Object {
    return undefined;
  }

  login(username: string, password: string, callback: IInsertCallback<ISession>): void {
    var options = {
      method: 'POST',
      path: this.basePath(),
      params: {
        username: username,
        password: password
      }
    };

    this.invoke(options, callback);
  }
}