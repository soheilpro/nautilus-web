import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { ITaskState } from './itask-state';
import { ITaskStateModule } from './itask-state-module';

export class TaskStateModule extends BaseModule implements ITaskStateModule {
  private taskStates: ITaskState[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.taskStates = (await this.client.itemStates.getAll({})).filter(itemState => itemState.itemKind === 'task');
  }

  getAll() {
    return this.taskStates.slice();
  }

  get(TaskState: ITaskState) {
    return _.find(this.taskStates, entityComparer.bind(null, TaskState));
  }
}
