import { IItem } from '../../sdk';
import * as NQL from '../../nql';
import { IModule } from '../imodule';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { IMilestone } from './imilestone';
import { ItemKind } from './item-kind';

export interface IItemModule extends IModule {
  getAllByKind(kind: ItemKind): Promise<IItem[]>;
  getAllMilestones(query: NQL.Expression): Promise<IMilestone[]>;
  getMilestone(item: IItem): IMilestone;
  getAllIssues(query: NQL.Expression): Promise<IItem[]>;
  getIssue(item: IItem): Promise<IItem>;
  addIssue(issue: IIssue): Promise<IIssue>;
  updateIssue(issueId: string, issueChange: IIssueChange): Promise<IIssue>;
  deleteIssue(issue: IIssue): Promise<void>;
}
