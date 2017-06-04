import * as NQL from '../../nql';
import { IModule } from '../imodule';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { IMilestone } from './imilestone';
import { IMilestoneChange } from './imilestone-change';

export interface IItemModule extends IModule {
  getAllIssues(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): Promise<IIssue[]>;
  getIssue(issue: IIssue): Promise<IIssue>;
  getIssueParent(issue: IIssue): IIssue;
  getIssueMilestone(issue: IIssue): IMilestone;
  addIssue(issue: IIssue): Promise<IIssue>;
  updateIssue(issueId: string, issueChange: IIssueChange): Promise<IIssue>;
  deleteIssue(issue: IIssue): Promise<void>;
  getAllMilestones(filterExpression: NQL.IExpression, sortExpressions: NQL.ISortExpression[]): IMilestone[];
  getMilestone(milestone: IMilestone): IMilestone;
  getMilestoneParent(milestone: IMilestone): IMilestone;
  addMilestone(milestone: IMilestone): Promise<IMilestone>;
  updateMilestone(milestoneId: string, milestoneChange: IMilestoneChange): Promise<IMilestone>;
  deleteMilestone(milestone: IMilestone): Promise<void>;
}
