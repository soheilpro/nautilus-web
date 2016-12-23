import { IApplication } from './application';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
}

export default class ServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;

  setApplication(application: IApplication) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }
}
