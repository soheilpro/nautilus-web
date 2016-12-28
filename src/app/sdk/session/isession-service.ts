import { IService } from '../iservice';
import { ISession } from './isession';
import { ISessionChange } from './isession-change';
import { ISessionFilter } from './isession-filter';

export interface ISessionService extends IService<ISession, ISessionFilter, ISessionChange> {
  create(username: string, password: string): Promise<ISession>;
}
