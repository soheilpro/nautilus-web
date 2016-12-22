import { IEntity, IFilter, IChange, IService, BaseService } from './base';
import { IUser } from './user';

export interface ISession extends IEntity {
  accessToken: string;
  user: IUser;
}

export interface ISessionFilter extends IFilter {
}

export interface ISessionChange extends IChange {
}

export interface ISessionService extends IService<ISession, ISessionFilter, ISessionChange> {
  create(username: string, password: string): Promise<ISession>;
}

export class SessionService extends BaseService<ISession, ISessionFilter, ISessionChange> implements ISessionService {
  basePath(): string {
    return '/sessions';
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

  create(username: string, password: string): Promise<ISession> {
    let options = {
      method: 'POST',
      path: this.basePath(),
      params: {
        username: username,
        password: password
      }
    };

    return this.invoke(options);
  }
}
