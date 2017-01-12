import { IShortcut } from '../keyboard';
import { ICommand } from './icommand';

export abstract class BaseCommand implements ICommand {
  abstract get id(): string;
  abstract get name(): string;

  get shortcut(): IShortcut
  {
    return null;
  }

  get isHidden() {
    return false;
  }

  get isDisabled() {
    return false;
  }

  abstract execute(): void;
}
