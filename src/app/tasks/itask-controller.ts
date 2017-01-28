import { ITask, IIssue } from '../application';

export interface ITaskController {
  addTask(issue: IIssue): void;
  editTask(task: ITask): void;
  deleteTask(task: ITask): void;
}
