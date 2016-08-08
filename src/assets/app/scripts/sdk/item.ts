import { IEntity, IFilter, IChange, IService, BaseService } from './base';

export interface IItem extends IEntity {
  sid: string;
  type?: IEntity;
  title?: string;
  description?: string;
  state?: IEntity;
  priority?: IEntity;
  project?: IEntity;
  subItems?: IEntity[];
  prerequisiteItems?: IEntity[];
  assignedUsers?: IEntity[];
  creator?: IEntity;
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
  subItems?: IEntity[];
  subItems_add?: IEntity[];
  subItems_remove?: IEntity[];
  prerequisiteItems?: IEntity[];
  prerequisiteItems_add?: IEntity[];
  prerequisiteItems_remove?: IEntity[];
  assignedUsers?: IEntity[];
  assignedUsers_add?: IEntity[];
  assignedUsers_remove?: IEntity[];
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
      type: this.toId(entity.type),
      title: entity.title,
      description: entity.description,
      state_id: this.toId(entity.state),
      priority_id: this.toId(entity.priority),
      project_id: this.toId(entity.project),
      sub_item_ids: this.toIdArray(entity.subItems),
      prerequisite_item_ids: this.toIdArray(entity.prerequisiteItems),
      assigned_user_ids: this.toIdArray(entity.assignedUsers),
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
      sub_item_ids: this.toIdArray(change.subItems),
      add_sub_item_ids: this.toIdArray(change.subItems_add),
      remove_sub_item_ids: this.toIdArray(change.subItems_remove),
      prerequisite_item_ids: this.toIdArray(change.prerequisiteItems),
      add_prerequisite_item_ids: this.toIdArray(change.prerequisiteItems_add),
      remove_prerequisite_item_ids: this.toIdArray(change.prerequisiteItems_remove),
      assigned_user_ids: this.toIdArray(change.assignedUsers),
      add_assigner_user_ids: this.toIdArray(change.assignedUsers_add),
      remove_assigner_user_ids: this.toIdArray(change.assignedUsers_remove),
    }
  }
}