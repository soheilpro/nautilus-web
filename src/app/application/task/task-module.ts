import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { IIssue } from '../issue';
import { ITask } from './itask';
import { ITaskChange } from './itask-change';
import { ITaskModule } from './itask-module';

export class TaskModule extends BaseModule implements ITaskModule {
  private tasks: ITask[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.tasks = (await this.client.items.getAll({})).filter(item => item.kind === 'task');
  }

  getAll() {
    return Promise.resolve(this.tasks);
  }

  search(query: string) {
    let tasks = this.tasks.filter(item => item.title && item.title.indexOf(query) !== -1);

    return Promise.resolve(tasks);
  }

  async add(task: ITask, issue: IIssue) {
    task.kind = 'task';
    task.parent = issue;

    task = await this.client.items.insert(task);
    this.tasks.push(task);

    this.emit('add', { task });

    return task;
  }

  async update(id: string, taskChange: ITaskChange) {
    let task = await this.client.items.update(id, taskChange);

    this.tasks[_.findIndex(this.tasks, task => task.id === id)] = task;

    this.emit('update', { task });

    return task;
  }

  async delete(task: ITask) {
    await this.client.items.delete(task.id);

    this.tasks.splice(this.tasks.indexOf(task) , 1);

    this.emit('delete', { task });
  }
}
