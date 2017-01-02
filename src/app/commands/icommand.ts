import { IShortcut } from '../keyboard';

export interface ICommand {
  id: string;
  name: string;
  shortcuts: IShortcut[];
  hidden: boolean;
  execute(): void;
}
