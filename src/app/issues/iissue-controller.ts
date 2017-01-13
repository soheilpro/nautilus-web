import { IIssue } from '../application';

export interface IIssueController {
  addIssue(): void;
  deleteIssue(issue: IIssue): void;
}
