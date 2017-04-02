import { IContext } from './icontext';
import { IContextProvider } from './icontext-provider';

export interface IContextManager {
  registerContextItemProvider(contextItemProvider: IContextProvider): void;
  unregisterContextItemProvider(contextItemProvider: IContextProvider): void;
  getContext(): IContext;
}
