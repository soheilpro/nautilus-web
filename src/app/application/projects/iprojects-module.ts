import { IClient, IProject } from '../../sdk';
import { IModule } from '../imodule';

export interface IProjectsModule extends IModule {
  getAll(): IProject[];
}
