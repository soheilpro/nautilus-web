import { IApplication } from '..';
import { IClient, IUser } from '../../sdk';
import { BaseModule } from '../base-module';
import { IUsersModule } from './iusers-module';

export class UsersModule extends BaseModule {
  private users: IUser[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.users = (await this.client.users.getAll({}));
  }

  getAll(): IUser[] {
    return this.users;
  }
}
