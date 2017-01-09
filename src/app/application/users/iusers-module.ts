import { IClient, IUser } from '../../sdk';
import { IModule } from '../imodule';

export interface IUsersModule extends IModule {
  getAll(): IUser[];
}
