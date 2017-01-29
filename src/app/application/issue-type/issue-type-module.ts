import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IIssueType } from './iissue-type';
import { IIssueTypeModule } from './iissue-type-module';

export class IssueTypeModule extends BaseModule implements IIssueTypeModule {
  private issueTypes: IIssueType[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.issueTypes = (await this.client.itemTypes.getAll({})).filter(itemType => itemType.itemKind === 'issue');
  }

  getAll() {
    return this.issueTypes.slice();
  }

  get(IssueType: IIssueType) {
    return _.find(this.issueTypes, entityComparer.bind(null, IssueType));
  }
}
