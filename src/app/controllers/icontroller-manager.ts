import { IIssueController } from '../issues';

export interface IControllerManager {
  setIssueController(issueController: IIssueController): void;
  getIssueController(): IIssueController;
}
