import { IIssue } from '../application';

export interface IIssueController {
  addIssue(): void;
  editIssue(issue: IIssue): void;
  deleteIssue(issue: IIssue): void;
}
