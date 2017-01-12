import EventEmitter = require('wolfy87-eventemitter');
import { IIssue } from '../application';
import { IIssueController } from './iissue-controller';

export class IssueController extends EventEmitter implements IIssueController {
  addIssue() {
    this.emit('addIssue');
  }

  deleteIssue(issue: IIssue) {
    this.emit('deleteIssue', { issue: issue });
  }
}
