import { KeyCode } from '../keyboard';
import { IKeyBindingProvider } from './ikey-binding-provider';

export class DefaultKeyBindingProvider implements IKeyBindingProvider {
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
}
