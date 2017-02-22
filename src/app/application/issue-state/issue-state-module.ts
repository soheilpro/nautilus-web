import * as _ from 'underscore';
import { IClient } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IIssueState } from './iissue-state';
import { IIssueStateModule } from './iissue-state-module';

export class IssueStateModule extends BaseModule implements IIssueStateModule {
  private issueStates: IIssueState[];

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.issueStates = (await this.client.itemStates.getAll({})).filter(itemState => itemState.itemKind === 'issue');
  }

  getAll() {
    return this.issueStates.slice();
  }

  get(IssueState: IIssueState) {
    return _.find(this.issueStates, _.partial(entityComparer, IssueState));
  }
}
