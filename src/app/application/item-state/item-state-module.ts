import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IItemState } from '../../sdk';
import { IItemStateModule } from './iitem-state-module';

export class ItemStateModule extends BaseModule implements IItemStateModule {
  private itemStates: IItemState[];

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.itemStates = await this.client.itemStates.getAll({});
  }

  getAll(itemKind: string) {
    return this.itemStates.filter(itemState => itemState.itemKind === itemKind);
  }

  get(ItemState: IItemState) {
    return _.find(this.itemStates, _.partial(entityComparer, ItemState));
  }
}
