import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { ITaskType } from './itask-type';
import { ITaskTypeModule } from './itask-type-module';

export class TaskTypeModule extends BaseModule implements ITaskTypeModule {
  private taskTypes: ITaskType[];

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.taskTypes = (await this.client.itemTypes.getAll({})).filter(itemType => itemType.itemKind === 'task');
  }

  getAll() {
    return this.taskTypes.slice();
  }

  get(TaskType: ITaskType) {
    return _.find(this.taskTypes, _.partial(entityComparer, TaskType));
  }
}
