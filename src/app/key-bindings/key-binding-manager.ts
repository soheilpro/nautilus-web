import { KeyCode } from '../keyboard';
import { IKeyBindingManager } from './ikey-binding-manager';

export class KeyBindingManager implements IKeyBindingManager {
  getKeyBindings() {
    return [
      {
        shortcut: [{ keyCode: KeyCode.P }],
        commandId: 'show-command-palette',
      },
      {
        shortcut: [{ keyCode: KeyCode.G }, { keyCode: KeyCode.I }],
        commandId: 'go-to-issues',
      },
      {
        shortcut: [{ keyCode: KeyCode.G }, { keyCode: KeyCode.M }],
        commandId: 'go-to-milestones',
      },
      {
        shortcut: [{ keyCode: KeyCode.G }, { keyCode: KeyCode.P }],
        commandId: 'go-to-projects',
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
