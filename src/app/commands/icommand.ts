import { IShortcut } from '../keyboard';

export interface ICommand {
  id: string;
  name: string;
  shortcut: IShortcut;
  visible: boolean;
  enabled: boolean;
  execute(): void;
}
