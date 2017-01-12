import { IIssue } from '../application';

export interface IIssueController extends EventEmitter {
  addIssue(): void;
  deleteIssue(issue: IIssue): void;
}
