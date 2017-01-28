import { IModule } from '../imodule';
import { ITaskState } from './itask-state';

export interface ITaskStateModule extends IModule {
  getAll(): ITaskState[];
  get(TaskState: ITaskState): ITaskState;
}
