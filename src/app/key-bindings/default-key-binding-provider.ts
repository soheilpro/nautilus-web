import { KeyCode } from '../keyboard';
import { IKeyBinding } from './ikey-binding';
import { IKeyBindingProvider } from './ikey-binding-provider';

export class DefaultKeyBindingProvider implements IKeyBindingProvider {
  getKeyBindings() {
    let keyBindings: IKeyBinding[] = [
      {
        shortcut: [{ keyCode: KeyCode.P }],
        commandId: 'search-commands',
      },
      {
        shortcut: [{ keyCode: KeyCode.S }],
        commandId: 'search-issues',
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

    return keyBindings;
  }
}
