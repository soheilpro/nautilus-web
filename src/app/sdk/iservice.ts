import { IChange } from './ichange';
import { IEntity } from './ientity';
import { IFilter } from './ifilter';

export interface IService<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  getAll(filter: TFilter): Promise<TEntity[]>;
  get(filter: TFilter): Promise<TEntity>;
  insert(entity: TEntity): Promise<TEntity>;
  update(id: string, change: TChange): Promise<TEntity>;
  delete(id: string): Promise<void>;
}
