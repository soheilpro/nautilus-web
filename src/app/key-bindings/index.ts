import { IShortcut, KeyCode, KeyCombination } from '../keyboard';

export interface IKeyBinding {
  shortcut: IShortcut;
  commandId: string;
}

export interface IKeyBindingManager {
  getKeyBindings(): IKeyBinding[];
  getShortcutsForCommand(commandId: string): IShortcut[];
}

export default class KeyBindingManager implements IKeyBindingManager {
  getKeyBindings() {
    return [
      {
        shortcut: [{ keyCode: KeyCode.P }],
        commandId: 'show-command-palette',
      },
      {
        shortcut: [{ keyCode: KeyCode.N }],
        commandId: 'new-issue',
      }
    ];
  }

  getShortcutsForCommand(commandId: string) {
    return this.getKeyBindings().filter(keyBinding => keyBinding.commandId === commandId).map(keyBinding => keyBinding.shortcut);
  }
}
