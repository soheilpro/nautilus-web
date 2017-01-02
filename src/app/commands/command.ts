import { IShortcut } from '../keyboard';
import { ICommand } from './icommand';

interface ICommandOptions {
  id: string;
  name: string;
  shortcuts?: IShortcut[];
  hidden?: boolean;
  onExecute: Function;
}

export class Command implements ICommand {
  id: string;
  name: string;
  shortcuts: IShortcut[];
  hidden: boolean;
  onExecute: Function;

  constructor({id, name, shortcuts, hidden, onExecute}: ICommandOptions) {
    this.id = id;
    this.name = name;
    this.shortcuts = shortcuts;
    this.hidden = hidden;
    this.onExecute = onExecute;
  }

  execute() {
    this.onExecute();
  }
}
