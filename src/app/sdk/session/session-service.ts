import { ServiceBase } from '../service-base';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';
import { ISessionFilter } from './isession-filter';
import { ISessionGetResult } from './isession-get-result';
import { ISessionService } from './isession-service';

export class SessionService extends ServiceBase<ISession, ISessionFilter, ISessionChange, ISessionGetResult> implements ISessionService {
  basePath(): string {
    return '/sessions';
  }

  serializeFilter(filter: ISessionFilter): Object {
    return undefined;
  }

  serializeEntity(entity: ISession): Object {
    return undefined;
  }

  serializeChange(change: ISessionChange): Object {
    return undefined;
  }

  create(username: string, password: string): Promise<ISession> {
    const options = {
      method: 'POST',
      path: this.basePath(),
      params: {
        username: username,
        password: password,
      },
    };

    return this.invoke(options);
  }
}
