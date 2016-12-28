import { ServiceBase } from '../service-base';
import { ISession } from './isession';
import { ISessionService } from './isession-service';
import { ISessionFilter } from './isession-filter';
import { ISessionChange } from './isession-change';

export class SessionService extends ServiceBase<ISession, ISessionFilter, ISessionChange> implements ISessionService {
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
