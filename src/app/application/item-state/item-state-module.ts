import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IItemState } from '../../sdk';
import { IItemStateModule } from './iitem-state-module';
import { ItemKind } from '../item';

export class ItemStateModule extends BaseModule implements IItemStateModule {
  private itemStates: IItemState[];

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.itemStates = _.sortBy(await this.client.itemStates.getAll({}), itemState => itemState.order);
  }

  getAll(itemKind: ItemKind) {
    return this.itemStates.filter(itemState => itemState.itemKind === itemKind);
  }

  get(ItemState: IItemState) {
    return _.find(this.itemStates, _.partial(entityComparer, ItemState));
  }
}
