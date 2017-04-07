import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IItemType } from '../../sdk';
import { IItemTypeModule } from './iitem-type-module';
import { ItemKind } from '../item';

export class ItemTypeModule extends BaseModule implements IItemTypeModule {
  private itemTypes: IItemType[];

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.itemTypes = await this.client.itemTypes.getAll({});
  }

  getAll(itemKind: ItemKind) {
    return this.itemTypes.filter(itemType => itemType.itemKind === itemKind);
  }

  get(ItemType: IItemType) {
    return _.find(this.itemTypes, _.partial(entityComparer, ItemType));
  }
}
