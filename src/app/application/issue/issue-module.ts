import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { IIssue } from './iissue';
import { IIssueModule } from './iissue-module';

export class IssueModule extends BaseModule implements IIssueModule {
  private issues: IIssue[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.issues = (await this.client.items.getAll({})).filter(item => item.kind === 'issue');
  }

  getAll() {
    return Promise.resolve(this.issues);
  }

  search(query: string) {
    let issues = this.issues.filter(item => item.title && item.title.indexOf(query) !== -1);

    return Promise.resolve(issues);
  }

  async add(issue: IIssue) {
    issue.kind = 'issue';

    issue = await this.client.items.insert(issue);
    this.issues.push(issue);

    this.emit('add', issue);

    return issue;
  }

  async delete(issue: IIssue) {
    await this.client.items.delete(issue.id);

    this.issues.splice(this.issues.indexOf(issue) , 1);

    this.emit('delete', issue);
  }
}
