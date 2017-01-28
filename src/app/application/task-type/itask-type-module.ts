import { IModule } from '../imodule';
import { ITaskType } from './itask-type';

export interface ITaskTypeModule extends IModule {
  getAll(): ITaskType[];
  get(TaskType: ITaskType): ITaskType;
}
