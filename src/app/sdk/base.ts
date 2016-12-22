import axios, { AxiosRequestConfig } from 'axios';
import * as _ from 'underscore';

import { IClient } from './client';

export interface IEntity {
  id?: string;
}

export interface IFilter {
  id?: string;
}

export interface IChange {
}

export interface IService<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  getAll(filter: TFilter): Promise<TEntity[]>;
  get(filter: TFilter): Promise<TEntity>;
  insert(entity: TEntity): Promise<TEntity>;
  update(id: string, change: TChange): Promise<TEntity>;
  delete(id: string): Promise<void>;
}

export abstract class BaseService<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  abstract basePath(): string;
  abstract filterToParams(filter: TFilter): Object;
  abstract entityToParams(entity: TEntity): Object;
  abstract changeToParams(change: TChange): Object;

  getAll(filter: TFilter): Promise<TEntity[]> {
    let options = {
      method: 'GET',
      path: this.basePath(),
      params: this.filterToParams(filter)
    };

    return this.invoke(options);
  }

  get(filter: TFilter): Promise<TEntity> {
    let options = {
      method: 'GET',
      path: this.basePath(),
      params: this.filterToParams(filter)
    };

    return this.invoke(options);
  }

  insert(entity: TEntity): Promise<TEntity> {
    let options = {
      method: 'POST',
      path: this.basePath(),
      params: this.entityToParams(entity)
    };

    return this.invoke(options);
  }

  update(id: string, change: TChange): Promise<TEntity> {
    let options = {
      method: 'PATCH',
      path: this.basePath() + '/' + id,
      params: this.changeToParams(change)
    };

    return this.invoke(options);
  }

  delete(id: string): Promise<void> {
    let options = {
      method: 'DELETE',
      path: this.basePath() + '/' + id
    };

    return this.invoke(options);
  }

  protected invoke(options: {method: string, path: string; params?: Object}): Promise<any> {
    let config: AxiosRequestConfig = {
      method: options.method,
      url: this.client.config.apiAddress + options.path,
      data: _.pick(options.params, (value: any) => value !== undefined),
      validateStatus: () => true
    };

    if (this.client.session) {
      config.auth = {
        username: this.client.session.accessToken,
        password: '-'
      };
    }

    return new Promise(async (resolve, reject) => {
      try {
        let result = await axios.request(config);
        resolve(result.data.data);
      }
      catch (error) {
        reject(error);
      }
    });
  }

  protected toId(object: IEntity): string {
    if (object === undefined)
      return undefined;

    if (object === null)
      return '';

    return object.id;
  }

  protected toIdArray(entities: IEntity[]): string {
    if (!entities)
      return undefined;

    let result = entities.map<IEntity>(this.toId.bind(this));

    if (result.length === 0)
      return undefined;

    return result.join(',');
  }
}
