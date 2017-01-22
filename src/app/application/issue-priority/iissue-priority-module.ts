import { IModule } from '../imodule';
import { IIssuePriority } from './iissue-priority';

export interface IIssuePriorityModule extends IModule {
  getAll(): IIssuePriority[];
  get(IssuePriority: IIssuePriority): IIssuePriority;
}
