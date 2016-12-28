import { IKeyBindingManager } from './ikey-binding-manager';
import { DefaultKeyBindingProvider } from './default-key-binding-provider';

export class KeyBindingManager implements IKeyBindingManager {
  private defaultKeyBindingProvider = new DefaultKeyBindingProvider();

  getKeyBindings() {
    return this.defaultKeyBindingProvider.getKeyBindings();
  }
}
