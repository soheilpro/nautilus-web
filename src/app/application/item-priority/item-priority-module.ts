import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IItemPriority } from '../../sdk';
import { IItemPriorityModule } from './iitem-priority-module';

export class ItemPriorityModule extends BaseModule implements IItemPriorityModule {
  private itemPriorities: IItemPriority[];

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.itemPriorities = await this.client.itemPriorities.getAll({});
  }

  getAll(itemKind: string) {
    return this.itemPriorities.filter(itemPriority => itemPriority.itemKind === itemKind);
  }

  get(ItemPriority: IItemPriority) {
    return _.find(this.itemPriorities, _.partial(entityComparer, ItemPriority));
  }
}
