import * as _ from 'underscore';
import { IClient, IUser } from '../../sdk';
import { IApplication } from '../iapplication';
import ArrayHelper from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IUserModule } from './iuser-module';

export class UserModule extends BaseModule implements IUserModule {
  private users: IUser[];
  private usersMap: { [id: string]: IUser };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.users = _.sortBy(await this.client.users.getAll({}), user => user.name);
    this.usersMap = ArrayHelper.toMap(this.users, user => user.id);
  }

  getAll() {
    return [...this.users];
  }

  get(user: IUser) {
    return this.usersMap[user.id];
  }
}
