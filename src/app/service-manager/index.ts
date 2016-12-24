import { IApplication } from '../application';
import { IController } from '../controller';

export interface IServiceManager {
  setApplication(application: IApplication): void;
  getApplication(): IApplication;
  setController(controller: IController): void;
  getController(): IController;
}

export default class ServiceManager {
  static Instance: IServiceManager;

  private application: IApplication;
  private controller: IController;

  setApplication(application: IApplication) {
    this.application = application;
  }

  getApplication() {
    return this.application;
  }

  setController(controller: IController) {
    this.controller = controller;
  }

  getController() {
    return this.controller;
  }
}
