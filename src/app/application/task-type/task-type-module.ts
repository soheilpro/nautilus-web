import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { ITaskType } from './itask-type';
import { ITaskTypeModule } from './itask-type-module';

export class TaskTypeModule extends BaseModule implements ITaskTypeModule {
  private taskTypes: ITaskType[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.taskTypes = (await this.client.itemTypes.getAll({})).filter(itemType => itemType.itemKind === 'task');
  }

  getAll() {
    return this.taskTypes;
  }

  get(TaskType: ITaskType) {
    return _.find(this.taskTypes, entityComparer.bind(null, TaskType));
  }
}
