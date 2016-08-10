import { INautilusClient } from './client';

export interface IEntity {
  id?: string;
}

export interface IFilter {
  id?: string;
}

export interface IChange {
}

export interface IGetAllCallback<TEntity extends IEntity> {
  (error: Error, entities?: TEntity[]): any
}

export interface IGetCallback<TEntity extends IEntity> {
  (error: Error, entity?: TEntity): any
}

export interface IInsertCallback<TEntity extends IEntity> {
  (error: Error, entity?: TEntity): any
}

export interface IUpdateCallback<TEntity extends IEntity> {
  (error: Error, entity?: TEntity): any
}

export interface IDeleteCallback {
  (error: Error): any
}

export interface IService<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  getAll(filter: TFilter, callback: IGetAllCallback<TEntity>): void;
  get(filter: TFilter, callback: IGetCallback<TEntity>): void;
  insert(entity: TEntity, callback: IInsertCallback<TEntity>): void;
  update(id: string, change: TChange, callback: IUpdateCallback<TEntity>): void;
  delete(id: string, callback: IDeleteCallback): void;
}

export abstract class BaseService<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  private client: INautilusClient;

  constructor(client: INautilusClient) {
    this.client = client;
  }

  abstract basePath(): string;
  abstract filterToParams(filter: TFilter): Object;
  abstract entityToParams(entity: TEntity): Object;
  abstract changeToParams(change: TChange): Object;

  getAll(filter: TFilter, callback: IGetAllCallback<TEntity>): void {
    var options = {
      method: 'GET',
      path: this.basePath(),
      params: this.filterToParams(filter)
    };

    this.invoke(options, callback);
  }

  get(filter: TFilter, callback: IGetCallback<TEntity>): void {
    var options = {
      method: 'GET',
      path: this.basePath(),
      params: this.filterToParams(filter)
    };

    this.invoke(options, callback);
  }

  insert(entity: TEntity, callback: IInsertCallback<TEntity>): void {
    var options = {
      method: 'POST',
      path: this.basePath(),
      params: this.entityToParams(entity)
    };

    this.invoke(options, callback);
  }

  update(id: string, change: TChange, callback: IUpdateCallback<TEntity>): void {
    var options = {
      method: 'PATCH',
      path: this.basePath() + '/' + id,
      params: this.changeToParams(change)
    };

    this.invoke(options, callback);
  }

  delete(id: string, callback: IDeleteCallback): void {
    var options = {
      method: 'DELETE',
      path: this.basePath() + '/' + id
    };

    this.invoke(options, callback);
  }

  protected invoke(options: {method: string, path: string; params?: Object}, callback: (error: Error, data?: Object) => void) {
    var settings = {
      method: options.method,
      url: this.client.address + options.path,
      data: options.params,
      headers: {
        Authorization: this.client.session ? 'Basic ' + window.btoa(this.client.session.accessToken + ':-') : undefined
      }
    };

    log.debug('Nautilus SDK:', settings.method, settings.url, settings.data);

    $.ajax(settings)
      .done((data) => {
        callback(null, data.data);
      })
      .fail((jqXHR, textStatus, error) => {
        callback(error);
      });
  }

  protected toId(object: IEntity): string {
    if (object === undefined)
      return undefined;

    if (object === null)
      return '';

    return object.id
  }

  protected toIdArray(entities: IEntity[]): string {
    if (!entities)
      return undefined;

    var result = entities.map<IEntity>(this.toId.bind(this));

    if (result.length === 0)
      return undefined;

    return result.join(',');
  }
}