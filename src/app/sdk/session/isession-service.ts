import { IService } from '../iservice';
import { ISession } from './isession';
import { ISessionFilter } from './isession-filter';
import { ISessionChange } from './isession-change';

export interface ISessionService extends IService<ISession, ISessionFilter, ISessionChange> {
  create(username: string, password: string): Promise<ISession>;
}
