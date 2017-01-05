import { IShortcut } from '../keyboard';

export interface ICommand {
  id: string;
  name: string;
  shortcuts: IShortcut[];
  isHidden: boolean;
  isDisabled: boolean;
  execute(): void;
}
