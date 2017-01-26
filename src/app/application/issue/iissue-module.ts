import { IModule } from '../imodule';
import { IIssue } from './iissue';
import { IIssueChange } from './iissue-change';

export interface IIssueModule extends IModule {
  getAll(): Promise<IIssue[]>;
  search(query: string): Promise<IIssue[]>;
  add(issue: IIssue): Promise<IIssue>;
  update(id: string, issueChange: IIssueChange): Promise<IIssue>;
  delete(issue: IIssue): Promise<void>;
}
