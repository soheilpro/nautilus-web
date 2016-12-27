import { IKeyBinding } from './ikey-binding';
import { IShortcut } from '../keyboard';

export interface IKeyBindingManager {
  getKeyBindings(): IKeyBinding[];
  getShortcutsForCommand(commandId: string): IShortcut[];
}
