import { IService } from '../iservice';
import { IProject } from './iproject';
import { IProjectFilter } from './iproject-filter';
import { IProjectChange } from './iproject-change';

export interface IProjectService extends IService<IProject, IProjectFilter, IProjectChange> {
}
