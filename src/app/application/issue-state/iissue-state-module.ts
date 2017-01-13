import { IModule } from '../imodule';
import { IIssueState } from './iissue-state';

export interface IIssueStateModule extends IModule {
  getAll(): IIssueState[];
}
