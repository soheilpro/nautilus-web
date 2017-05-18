import * as _ from 'underscore';
import * as NQL from '../../nql';
import { IClient, IItem } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IItemModule } from './iitem-module';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { IMilestone } from './imilestone';
import Milestone from './milestone';
import IssueFilter from './issue-filter';

export class ItemModule extends BaseModule implements IItemModule {
  private milestones: IMilestone[];
  private issues: IIssue[];

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    const items = await this.client.items.getAll({});

    this.milestones = [];
    this.issues = [];

    for (const item of items) {
      switch (item.kind) {
        case 'milestone':
          this.milestones.push(new Milestone(item, this.application));
          break;

        case 'issue':
          this.issues.push(item);
          break;
      }
    }
  }

  getAllMilestones(query: NQL.Expression) {
    let milestones = [...this.milestones];

    if (query) {
      const milestoneFilter = new IssueFilter();
      const predicate = milestoneFilter.getPredicate(query);

      milestones = milestones.filter(predicate);
    }

    return Promise.resolve(milestones);
  }

  getMilestone(item: IItem) {
    return _.find(this.milestones, _.partial(entityComparer, item));
  }

  async addIssue(issue: IIssue) {
    issue.kind = 'issue';

    issue = await this.client.items.insert(issue);
    this.issues.push(issue);

    this.emit('issue.add', { issue });

    return issue;
  }

  getAllIssues(query: NQL.Expression) {
    let issues = [...this.issues];

    if (query) {
      const issueFilter = new IssueFilter();
      const predicate = issueFilter.getPredicate(query);

      issues = issues.filter(predicate);
    }

    return Promise.resolve(issues);
  }

  getIssue(item: IItem) {
    return Promise.resolve(_.find(this.issues, _.partial(entityComparer, item)));
  }

  async updateIssue(issueId: string, issueChange: IIssueChange) {
    const issue = await this.client.items.update(issueId, issueChange);

    this.issues[_.findIndex(this.issues, issue => issue.id === issueId)] = issue;

    this.emit('issue.update', { issue });

    return issue;
  }

  async deleteIssue(issue: IIssue)  {
    await this.client.items.delete(issue.id);

    this.issues.splice(this.issues.indexOf(issue) , 1);

    this.emit('issue.delete', { issue });
  }
}
