import { ISession, IUser, IUserPermission, IItem } from '../sdk';
import { IIssuesModule } from './issues';

export interface IApplication extends EventEmitter {
  isInitialized(): boolean;
  initialize(): void;

  isLoggedIn(): boolean;
  logIn(username: string, password: string): Promise<ISession>;

  isLoaded(): boolean;

  getSession(): ISession;

  issues: IIssuesModule;
}
