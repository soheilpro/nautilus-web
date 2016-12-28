import { IUserService } from './user';
import { ISessionService, ISession } from './session';
import { IProjectService } from './project';
import { IItemPriorityService } from './item-priority';
import { IItemStateService } from './item-state';
import { IItemTypeService } from './item-type';
import { IItemService } from './item';

export interface IClient {
  address: string;
  session: ISession;
  users: IUserService;
  sessions: ISessionService;
  projects: IProjectService;
  itemPriorities: IItemPriorityService;
  itemStates: IItemStateService;
  itemTypes: IItemTypeService;
  items: IItemService;
}
