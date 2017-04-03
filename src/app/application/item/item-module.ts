import * as _ from 'underscore';
import * as NQL from '../../nql';
import { IClient, IItem, IItemChange } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { IItemModule } from './iitem-module';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { ITask } from './itask';
import { ITaskChange } from './itask-change';
import { isIssue } from './is-issue';
import { isTask } from './is-task';
import { entityComparer } from '../entity-comparer';
import IssueFilter from './issue-filter';
import TaskFilter from './task-filter';

export class ItemModule extends BaseModule implements IItemModule {
  private items: IItem[];

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.items = await this.client.items.getAll({});
  }

  getAll(issueQuery: NQL.Expression, taskQuery: NQL.Expression) {
    let issues = this.items.filter(isIssue);

    if (issueQuery) {
      const issueFilter = new IssueFilter();
      const predicate = issueFilter.getPredicate(issueQuery);

      issues = issues.filter(predicate);
    }

    let tasks = this.items.filter(item => isTask(item) && issues.some(issue => entityComparer(item.parent, issue)));

    if (taskQuery) {
      const taskFilter = new TaskFilter();
      const predicate = taskFilter.getPredicate(taskQuery);
      tasks = tasks.filter(predicate);

      // Remove issues that are not parent of any tasks
      issues = issues.filter(issue => tasks.some(task => entityComparer(task.parent, issue)));
    }

    const items = issues.concat(tasks);

    return Promise.resolve(items);
  }

  searchIssues(query: string) {
    const items = this.items.filter(item => isIssue(item) && item.title && item.title.indexOf(query) !== -1);

    return Promise.resolve(items);
  }

  private async add(item: IItem) {
    item = await this.client.items.insert(item);
    this.items.push(item);

    this.emit('add', { item });

    return item;
  }

  async addIssue(issue: IIssue) {
    issue.kind = 'issue';

    return this.add(issue);
  }

  async addTask(task: ITask, issue: IIssue) {
    task.kind = 'task';
    task.parent = issue;

    return this.add(task);
  }

  private async update(itemId: string, itemChange: IItemChange) {
    const item = await this.client.items.update(itemId, itemChange);

    this.items[_.findIndex(this.items, item => item.id === itemId)] = item;

    this.emit('update', { item });

    return item;
  }

  async updateIssue(issueId: string, issueChange: IIssueChange) {
    return this.update(issueId, issueChange);
  }

  async updateTask(taskId: string, taskChange: ITaskChange) {
    return this.update(taskId, taskChange);
  }

  private async delete(item: IItem) {
    await this.client.items.delete(item.id);

    this.items.splice(this.items.indexOf(item) , 1);

    this.emit('delete', { item });
  }

  async deleteIssue(issue: IIssue)  {
    return this.delete(issue);
  }

  async deleteTask(task: ITask)  {
    return this.delete(task);
  }
}
