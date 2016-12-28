import { ISession, IUser, IUserPermission } from '../sdk';
import { IIssue } from './iissue';

export interface IApplication extends EventEmitter {
  isInitialized(): boolean;
  initialize(): void;

  isLoggedIn(): boolean;
  logIn(username: string, password: string): Promise<ISession>;

  isLoaded(): boolean;

  getCurrentUser(): IUser;
  getCurrentUserPermissions(): IUserPermission[];

  getUser(user: IUser): IUser;

  getIssues(): Promise<IIssue[]>;
}
