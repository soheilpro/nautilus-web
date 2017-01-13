import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { IIssuePriority } from './iissue-priority';
import { IIssuePriorityModule } from './iissue-priority-module';

export class IssuePriorityModule extends BaseModule implements IIssuePriorityModule {
  private issuePriorities: IIssuePriority[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.issuePriorities = await this.client.itemPriorities.getAll({});
  }

  getAll() {
    return this.issuePriorities;
  }
}
