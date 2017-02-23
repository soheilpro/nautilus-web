import { ISession } from '../sdk';
import { IItemModule } from './item';
import { IItemPriorityModule } from './item-priority';
import { IItemStateModule } from './item-state';
import { IItemTypeModule } from './item-type';
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
  itemPriorities: IItemPriorityModule;
  itemStates: IItemStateModule;
  itemTypes: IItemTypeModule;
}
