import { IModule } from '../imodule';
import { IIssueType } from './iissue-type';

export interface IIssueTypeModule extends IModule {
  getAll(): IIssueType[];
}
