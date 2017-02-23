import * as _ from 'underscore';
import { IClient, IProject } from '../../sdk';
import { IApplication } from '../iapplication';
import { BaseModule } from '../base-module';
import { entityComparer } from '../entity-comparer';
import { IProjectModule } from './iproject-module';

export class ProjectModule extends BaseModule implements IProjectModule {
  private projects: IProject[];

  constructor(private application: IApplication, private client: IClient) {
    super();
  }

  async load() {
    this.projects = await this.client.projects.getAll({});
  }

  getAll() {
    return this.projects.slice();
  }

  get(project: IProject) {
    return _.find(this.projects, _.partial(entityComparer, project));
  }
}