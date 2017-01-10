import { ISession, IUser, IUserPermission, IItem } from '../sdk';
import { IIssueModule } from './issue';
import { IIssuePriorityModule } from './issue-priority';
import { IIssueStateModule } from './issue-state';
import { IIssueTypeModule } from './issue-type';
import { IProjectModule } from './project';
import { IUserModule } from './user';

export interface IApplication extends EventEmitter {
  isInitialized(): boolean;
  initialize(): void;

  isLoggedIn(): boolean;
  logIn(username: string, password: string): Promise<ISession>;

  isLoaded(): boolean;

  getSession(): ISession;

  users: IUserModule;
  projects: IProjectModule;
  issuePriorities: IIssuePriorityModule;
  issueStates: IIssueStateModule;
  issueTypes: IIssueTypeModule;
  issues: IIssueModule;
}
