import * as _ from 'underscore';
import * as NQL from '../../nql';
import { IClient, IItem, IItemChange } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { IItemModule } from './iitem-module';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { isIssue } from './is-issue';
import { entityComparer } from '../entity-comparer';
import { ItemKind } from './item-kind';
import IssueFilter from './issue-filter';

export class ItemModule extends BaseModule implements IItemModule {
  private items: IItem[];

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.items = await this.client.items.getAll({});
  }

  getAllByKind(kind: ItemKind) {
    const items = this.items.filter(item => item.kind === kind);

    return Promise.resolve(items);
  }

  getAll(issueQuery: NQL.Expression) {
    let issues = this.items.filter(isIssue);

    if (issueQuery) {
      const issueFilter = new IssueFilter();
      const predicate = issueFilter.getPredicate(issueQuery);

      issues = issues.filter(predicate);
    }

    return Promise.resolve(issues);
  }

  get(item: IItem) {
    return Promise.resolve(_.find(this.items, _.partial(entityComparer, item)));
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

  private async update(itemId: string, itemChange: IItemChange) {
    const item = await this.client.items.update(itemId, itemChange);

    this.items[_.findIndex(this.items, item => item.id === itemId)] = item;

    this.emit('update', { item });

    return item;
  }

  async updateIssue(issueId: string, issueChange: IIssueChange) {
    return this.update(issueId, issueChange);
  }

  private async delete(item: IItem) {
    await this.client.items.delete(item.id);

    this.items.splice(this.items.indexOf(item) , 1);

    this.emit('delete', { item });
  }

  async deleteIssue(issue: IIssue)  {
    return this.delete(issue);
  }
}
