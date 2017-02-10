import { ISession } from '../sdk';
import { IItemModule } from './item';
import { IIssuePriorityModule } from './issue-priority';
import { IIssueStateModule } from './issue-state';
import { IIssueTypeModule } from './issue-type';
import { ITaskStateModule } from './task-state';
import { ITaskTypeModule } from './task-type';
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
  items: IItemModule;
  issuePriorities: IIssuePriorityModule;
  issueStates: IIssueStateModule;
  issueTypes: IIssueTypeModule;
  taskStates: ITaskStateModule;
  taskTypes: ITaskTypeModule;
}
