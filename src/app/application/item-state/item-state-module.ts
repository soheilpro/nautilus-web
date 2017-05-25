import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import ArrayHelper from '../../utilities/array-helper';
import { BaseModule } from '../base-module';
import { IItemState } from '../../sdk';
import { IItemStateModule } from './iitem-state-module';
import { ItemKind } from '../item';

export class ItemStateModule extends BaseModule implements IItemStateModule {
  private itemStates: IItemState[];
  private itemStatesMap: { [id: string]: IItemState };

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.itemStates = _.sortBy(await this.client.itemStates.getAll({}), itemState => itemState.order);
    this.itemStatesMap = ArrayHelper.toMap(this.itemStates, itemState => itemState.id);
  }

  getAll(itemKind: ItemKind) {
    return this.itemStates.filter(itemState => itemState.itemKind === itemKind);
  }

  get(itemState: IItemState) {
    return this.itemStatesMap[itemState.id];
  }
}
