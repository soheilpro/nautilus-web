import { IItem } from '../../sdk';
import * as NQL from '../../nql';
import { IModule } from '../imodule';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { ItemKind } from './item-kind';

export interface IItemModule extends IModule {
  getAllByKind(kind: ItemKind): Promise<IItem[]>;
  getAll(issueQuery: NQL.Expression): Promise<IItem[]>;
  get(item: IItem): Promise<IItem>;
  searchIssues(query: string): Promise<IIssue[]>;
  addIssue(issue: IIssue): Promise<IIssue>;
  updateIssue(issueId: string, issueChange: IIssueChange): Promise<IIssue>;
  deleteIssue(issue: IIssue): Promise<void>;
}
