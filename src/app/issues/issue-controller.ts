import EventEmitter = require('wolfy87-eventemitter');
import { IIssueController } from './iissue-controller';

export class IssueController extends EventEmitter implements IIssueController {
  addIssue() {
    this.emit('addIssue');
  }
}
