import { IKeyBindingManager } from './ikey-binding-manager';
import { KeyCode } from '../keyboard';

export class KeyBindingManager implements IKeyBindingManager {
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
