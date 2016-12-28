import { IService } from '../iservice';
import { IUser } from './iuser';
import { IUserChange } from './iuser-change';
import { IUserFilter } from './iuser-filter';
import { IUserPermission } from './iuser-permission';

export interface IUserService extends IService<IUser, IUserFilter, IUserChange> {
  getUserPermissions(user: IUser): Promise<IUserPermission[]>;
}
