import * as _ from 'underscore';
import { IClient, IUser } from '../../sdk';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IUserModule } from './iuser-module';

export class UserModule extends BaseModule implements IUserModule {
  private users: IUser[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.users = (await this.client.users.getAll({}));
  }

  getAll() {
    return this.users.slice();
  }

  get(user: IUser) {
    return _.find(this.users, entityComparer.bind(null, user));
  }
}
