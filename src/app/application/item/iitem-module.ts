import { IItem } from '../../sdk';
import * as NQL from '../../nql';
import { IModule } from '../imodule';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';
import { ITask } from './itask';
import { ITaskChange } from './itask-change';
import { ItemKind } from './item-kind';

export interface IItemModule extends IModule {
  getAllByKind(kind: ItemKind): Promise<IItem[]>;
  getAll(issueQuery: NQL.Expression, taskQuery: NQL.Expression): Promise<IItem[]>;
  get(item: IItem): Promise<IItem>;
  searchIssues(query: string): Promise<IIssue[]>;
  addIssue(issue: IIssue): Promise<IIssue>;
  addTask(task: ITask, issue: IIssue): Promise<ITask>;
  updateIssue(issueId: string, issueChange: IIssueChange): Promise<IIssue>;
  updateTask(issueId: string, taskChange: ITaskChange): Promise<ITask>;
  deleteIssue(issue: IIssue): Promise<void>;
  deleteTask(task: ITask): Promise<void>;
}
