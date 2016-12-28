import { IKeyBinding } from './ikey-binding';

export interface IKeyBindingProvider {
  getKeyBindings(): IKeyBinding[];
}
