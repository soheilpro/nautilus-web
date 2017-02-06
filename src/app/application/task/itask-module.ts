import { IModule } from '../imodule';
import { IIssue } from '../issue';
import { ITask } from './itask';
import { ITaskChange } from './itask-change';

export interface ITaskModule extends IModule {
  getAll(): Promise<ITask[]>;
  getAllForIssues(issues: IIssue[]): Promise<ITask[]>;
  search(query: string): Promise<ITask[]>;
  add(task: ITask, issue: IIssue): Promise<ITask>;
  update(id: string, taskChange: ITaskChange): Promise<ITask>;
  delete(task: ITask): Promise<void>;
}
