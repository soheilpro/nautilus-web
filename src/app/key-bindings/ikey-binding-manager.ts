import { IShortcut } from '../keyboard';
import { IKeyBinding } from './ikey-binding';

export interface IKeyBindingManager {
  getKeyBindings(): IKeyBinding[];
  getShortcutsForCommand(commandId: string): IShortcut[];
}
