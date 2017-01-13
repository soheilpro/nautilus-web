import { IClient } from '../../sdk';
import { BaseModule } from '../base-module';
import { IIssueState } from './iissue-state';
import { IIssueStateModule } from './iissue-state-module';

export class IssueStateModule extends BaseModule implements IIssueStateModule {
  private issueStates: IIssueState[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.issueStates = (await this.client.itemStates.getAll({})).filter(itemState => itemState.itemKind === 'issue');
  }

  getAll() {
    return this.issueStates;
  }
}
