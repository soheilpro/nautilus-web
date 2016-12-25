import { IShortcut } from '../keyboard';

export interface ICommand {
  id: string;
  name: string;
  shortcut: IShortcut;
  hidden: boolean;
  do(): void;
}

export class Command implements ICommand {
  id: string;
  name: string;
  shortcut: IShortcut;
  hidden: boolean;
  doAction: Function;

  constructor(options: {id: string, name: string, doAction: Function, shortcut?: IShortcut, hidden?: boolean}) {
    this.id = options.id;
    this.name = options.name;
    this.shortcut = options.shortcut;
    this.hidden = options.hidden;
    this.doAction = options.doAction;
  }

  do() {
    this.doAction();
  }
}

export interface ICommandProvider {
  getCommands(): ICommand[];
}

export interface IController {
  registerCommandProvider(commandProvider: ICommandProvider): void;
  unregisterCommandProvider(commandProvider: ICommandProvider): void;
  getCommands(): ICommand[];
}

export default class Controller implements IController {
  private commandProviders: ICommandProvider[] = [];

  registerCommandProvider(commandProvider: ICommandProvider) {
    this.commandProviders.push(commandProvider);
  }

  unregisterCommandProvider(commandProvider: ICommandProvider) {
    let index = this.commandProviders.indexOf(commandProvider);
    this.commandProviders.splice(index, 1);
  }

  getCommands() {
    let commands: ICommand[] = [];

    for (let commandProvider of this.commandProviders)
      for (let command of commandProvider.getCommands())
        commands.push(command);

    return commands;
  }
}
