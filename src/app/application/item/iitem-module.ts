import { IItem } from '../../sdk';
import * as NQL from '../../nql';
import { IModule } from '../imodule';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { IMilestone } from './imilestone';
import { IMilestoneChange } from './imilestone-change';

export interface IItemModule extends IModule {
  getAllIssues(filterExpression: NQL.Expression, sortExpressions: NQL.ISortExpression[]): Promise<IItem[]>;
  getIssue(item: IItem): Promise<IItem>;
  addIssue(issue: IIssue): Promise<IIssue>;
  updateIssue(issueId: string, issueChange: IIssueChange): Promise<IIssue>;
  deleteIssue(issue: IIssue): Promise<void>;
  getAllMilestones(filterExpression: NQL.Expression, sortExpressions: NQL.ISortExpression[]): IMilestone[];
  getMilestone(item: IItem): IMilestone;
  addMilestone(milestone: IMilestone): Promise<IMilestone>;
  updateMilestone(milestoneId: string, milestoneChange: IMilestoneChange): Promise<IMilestone>;
  deleteMilestone(milestone: IMilestone): Promise<void>;
}
