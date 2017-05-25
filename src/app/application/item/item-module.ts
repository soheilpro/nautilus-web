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
import MilestoneExpressionNormalizer from './milestone-expression-normalizer';
import IssueExpressionNormalizer from './issue-expression-normalizer';
import Query from './query';

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
  }

  getAllIssues(filterExpression: NQL.Expression, sortExpressions: NQL.ISortExpression[]) {
    let issues = [...this.issues];

    const expressionNormalizer = new IssueExpressionNormalizer();

    if (filterExpression)
      issues = this.filter(issues, filterExpression, expressionNormalizer);

    if (sortExpressions)
      issues = this.sort(issues, sortExpressions, expressionNormalizer);

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

  getAllMilestones(filterExpression: NQL.Expression, sortExpressions: NQL.ISortExpression[]) {
    let milestones = [...this.milestones];

    const expressionNormalizer = new MilestoneExpressionNormalizer();

    if (filterExpression)
      milestones = this.filter(milestones, filterExpression, expressionNormalizer);

    if (sortExpressions)
      milestones = this.sort(milestones, sortExpressions, expressionNormalizer);

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

  private filter<T>(items: T[], expression: NQL.IExpression, expressionNormalizer: NQL.ExpressionTransformer<{}>) {
    const predicate = new Query().getPredicate<T>(expressionNormalizer.transform(expression, null));

    return items = items.filter(predicate);
  }

  private sort<T>(items: T[], sortExpressions: NQL.ISortExpression[], expressionNormalizer: NQL.ExpressionTransformer<{}>) {
    const query = new Query();

    const newSortExpressions = sortExpressions.map(sortExpression => {
      return {
        compare: query.getComparer<T>(expressionNormalizer.transform(sortExpression.expression, null)),
        order: sortExpression.order,
      };
    });

    return items.sort((item1, item2) => {
      for (const sortExpression of newSortExpressions) {
        const result = sortExpression.compare(item1, item2);

        if (result !== 0)
          return sortExpression.order * result;
      }

      return 0;
    });
  }
}
