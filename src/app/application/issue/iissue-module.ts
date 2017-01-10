import { IModule } from '../imodule';
import { IIssue } from './iissue';

export interface IIssueModule extends IModule {
  getAll(): Promise<IIssue[]>;
  search(query: string): Promise<IIssue[]>;
  add(issue: IIssue): Promise<IIssue>;
  delete(issue: IIssue): Promise<void>;
}
