import { IShortcut } from '../keyboard';

export interface ICommand {
  id: string;
  name: string;
  shortcut: IShortcut;
  isHidden: boolean;
  isDisabled: boolean;
  execute(): void;
}
