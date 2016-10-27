import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItem extends IEntity {
  sid: string;
  kind?: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];
  project?: IEntity;
  parent?: IEntity;
  assignedTo?: IEntity;
  createdBy?: IEntity;
  modifiedBy?: IEntity;
}

export interface IItemFilter extends IFilter {
  type?: string;
}

export interface IItemChange extends IChange {
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  tags?: string[];  
  project?: IEntity;
  parent?: IEntity;
  assignedTo?: IEntity;
}

export interface IItemService extends IService<IItem, IItemFilter, IItemChange> {
}

export class ItemService extends BaseService<IItem, IItemFilter, IItemChange> implements IItemService {
  basePath(): string {
    return "/items";
  }

  filterToParams(filter: IItemFilter): Object {
    return {
      type: filter.type
    }
  }

  entityToParams(entity: IItem): Object {
    return {
      kind: entity.kind,
      type_id: this.toId(entity.type),
      title: entity.title,
      description: entity.description,
      state_id: this.toId(entity.state),
      priority_id: this.toId(entity.priority),
      tags: entity.tags ? entity.tags.join(' ') : undefined,
      project_id: this.toId(entity.project),
      parent_id: this.toId(entity.parent),
      assigned_to_id: this.toId(entity.assignedTo),
    };
  }

  changeToParams(change: IItemChange): Object {
    return {
      type_id: this.toId(change.type),
      title: change.title,
      description: change.description,
      state_id: this.toId(change.state),
      priority_id: this.toId(change.priority),
      tags: change.tags ? change.tags.join(' ') : undefined,
      project_id: this.toId(change.project),
      parent_id: this.toId(change.parent),
      assigned_to_id: this.toId(change.assignedTo),
    }
  }
}