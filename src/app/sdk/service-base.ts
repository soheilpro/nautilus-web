import * as _ from 'underscore';
import axios, { AxiosRequestConfig } from 'axios';
import { IChange } from './ichange';
import { IClient } from './iclient';
import { IEntity } from './ientity';
import { IFilter } from './ifilter';

export abstract class ServiceBase<TEntity extends IEntity, TFilter extends IFilter, TChange extends IChange> {
  private client: IClient;

  constructor(client: IClient) {
    this.client = client;
  }

  abstract basePath(): string;
  abstract filterToParams(filter: TFilter): Object;
  abstract entityToParams(entity: TEntity): Object;
  abstract changeToParams(change: TChange): Object;

  getAll(filter: TFilter): Promise<TEntity[]> {
    const options = {
      method: 'GET',
      path: this.basePath(),
      params: this.filterToParams(filter)
    };

    return this.invoke(options);
  }

  get(filter: TFilter): Promise<TEntity> {
    const options = {
      method: 'GET',
      path: this.basePath(),
      params: this.filterToParams(filter)
    };

    return this.invoke(options);
  }

  insert(entity: TEntity): Promise<TEntity> {
    const options = {
      method: 'POST',
      path: this.basePath(),
      params: this.entityToParams(entity)
    };

    return this.invoke(options);
  }

  update(id: string, change: TChange): Promise<TEntity> {
    const options = {
      method: 'PATCH',
      path: this.basePath() + '/' + id,
      params: this.changeToParams(change)
    };

    return this.invoke(options);
  }

  delete(id: string): Promise<void> {
    const options = {
      method: 'DELETE',
      path: this.basePath() + '/' + id
    };

    return this.invoke(options);
  }

  protected invoke(options: {method: string, path: string; params?: Object}): Promise<any> {
    const config: AxiosRequestConfig = {
      method: options.method,
      url: this.client.address + options.path,
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
        const result = await axios.request(config);
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

    const result = entities.map<IEntity>(this.toId.bind(this));

    if (result.length === 0)
      return undefined;

    return result.join(',');
  }
}
