import { IService } from '../iservice';
import { IProject } from './iproject';
import { IProjectChange } from './iproject-change';
import { IProjectFilter } from './iproject-filter';

export interface IProjectService extends IService<IProject, IProjectFilter, IProjectChange> {
}
