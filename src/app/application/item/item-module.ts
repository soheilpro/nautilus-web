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
import { IMilestoneChange } from './imilestone-change';
import Milestone from './milestone';
import Issue from './issue';
import IssueFilter from './issue-filter';
import MilestoneFilter from './milestone-filter';

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
          this.issues.push(new Issue(item, this.application));
          break;
      }
    }

    this.milestones = _.sortBy(this.milestones, milestone => milestone.fullTitle);
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

  async addIssue(issue: IIssue) {
    const item = {
      ...issue,
      kind: 'issue',
    };

    issue = new Issue(await this.client.items.insert(item), this.application);
    this.issues.push(issue);

    this.emit('issue.add', { issue });

    return issue;
  }

  async updateIssue(issueId: string, issueChange: IIssueChange) {
    const issue = new Issue(await this.client.items.update(issueId, issueChange), this.application);

    this.issues[_.findIndex(this.issues, issue => issue.id === issueId)] = issue;

    this.emit('issue.update', { issue });

    return issue;
  }

  async deleteIssue(issue: IIssue)  {
    await this.client.items.delete(issue.id);

    this.issues.splice(this.issues.indexOf(issue), 1);

    this.emit('issue.delete', { issue });
  }

  getAllMilestones(query: NQL.Expression) {
    let milestones = [...this.milestones];

    if (query) {
      const issueFilter = new MilestoneFilter();
      const predicate = issueFilter.getPredicate(query);

      milestones = milestones.filter(predicate);
    }

    return milestones;
  }

  getMilestone(item: IItem) {
    return _.find(this.milestones, _.partial(entityComparer, item));
  }

  async addMilestone(milestone: IMilestone) {
    const item = {
      ...milestone,
      kind: 'milestone',
    };

    milestone = new Milestone(await this.client.items.insert(item), this.application);
    this.milestones.push(milestone);

    this.emit('milestone.add', { milestone });

    return milestone;
  }

  async updateMilestone(milestoneId: string, milestoneChange: IMilestoneChange) {
    const milestone = new Milestone(await this.client.items.update(milestoneId, milestoneChange), this.application);

    this.milestones[_.findIndex(this.milestones, milestone => milestone.id === milestoneId)] = milestone;

    this.emit('milestone.update', { milestone });

    return milestone;
  }

  async deleteMilestone(milestone: IMilestone)  {
    await this.client.items.delete(milestone.id);

    this.milestones.splice(this.milestones.indexOf(milestone), 1);

    this.emit('milestone.delete', { milestone });
  }
}
