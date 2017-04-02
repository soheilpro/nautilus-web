import { IContextManager } from './icontext-manager';
import { IContextProvider } from './icontext-provider';

export class ContextManager implements IContextManager {
  private contextItemProviders: IContextProvider[] = [];

  registerContextItemProvider(contextItemProvider: IContextProvider) {
    this.contextItemProviders.push(contextItemProvider);
  }

  unregisterContextItemProvider(contextItemProvider: IContextProvider) {
    this.contextItemProviders.splice(this.contextItemProviders.indexOf(contextItemProvider), 1);
  }

  getContext() {
    let context = {};

    for (const contextItemProvider of this.contextItemProviders)
      context = {...context, ...contextItemProvider.getContext()};

    return context;
  }
}
