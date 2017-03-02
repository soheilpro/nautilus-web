import { ServiceBase } from '../service-base';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';
import { ISessionFilter } from './isession-filter';
import { ISessionService } from './isession-service';

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
    const options = {
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
