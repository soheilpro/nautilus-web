import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItem extends IEntity {
  sid: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  project?: IEntity;
  parent?: IEntity;
  prerequisiteItems?: IEntity[];
  assignedTo?: IEntity;
  createdBy?: IEntity;
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
  project?: IEntity;
  parent?: IEntity;
  prerequisiteItems?: IEntity[];
  prerequisiteItems_add?: IEntity[];
  prerequisiteItems_remove?: IEntity[];
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
      type_id: this.toId(entity.type),
      title: entity.title,
      description: entity.description,
      state_id: this.toId(entity.state),
      priority_id: this.toId(entity.priority),
      project_id: this.toId(entity.project),
      parent_id: this.toId(entity.parent),
      prerequisite_item_ids: this.toIdArray(entity.prerequisiteItems),
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
      project_id: this.toId(change.project),
      parent_id: this.toId(change.parent),
      prerequisite_item_ids: this.toIdArray(change.prerequisiteItems),
      add_prerequisite_item_ids: this.toIdArray(change.prerequisiteItems_add),
      remove_prerequisite_item_ids: this.toIdArray(change.prerequisiteItems_remove),
      assigned_to_id: this.toId(change.assignedTo),
    }
  }
}