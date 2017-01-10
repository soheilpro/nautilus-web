import { IClient, IProject } from '../../sdk';
import { IModule } from '../imodule';

export interface IProjectModule extends IModule {
  getAll(): IProject[];
}
