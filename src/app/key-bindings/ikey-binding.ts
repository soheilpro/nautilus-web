import { IShortcut } from '../keyboard';

export interface IKeyBinding {
  shortcut: IShortcut;
  commandId: string;
}
