import { IApplication } from '..';
import { IClient, IProject } from '../../sdk';
import { BaseModule } from '../base-module';
import { IProjectsModule } from './iprojects-module';

export class ProjectsModule extends BaseModule {
  private projects: IProject[];

  constructor(private client: IClient) {
    super();
  }

  async load() {
    this.projects = (await this.client.projects.getAll({}));
  }

  getAll(): IProject[] {
    return this.projects;
  }
}
