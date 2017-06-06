import { IIssue } from '../application';

export interface IIssueController {
  addIssue(parentIssue?: IIssue): void;
  editIssue(issue: IIssue): void;
  deleteIssue(issue: IIssue): void;
}
