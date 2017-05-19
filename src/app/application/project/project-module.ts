import * as _ from 'underscore';
import { IClient, IProject } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IProjectModule } from './iproject-module';

export class ProjectModule extends BaseModule implements IProjectModule {
  private projects: IProject[];

  constructor(application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.projects = _.sortBy(await this.client.projects.getAll({}), project => project.name);
  }

  getAll() {
    return [...this.projects];
  }

  get(project: IProject) {
    return _.find(this.projects, _.partial(entityComparer, project));
  }
}
