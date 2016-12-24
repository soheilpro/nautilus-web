export interface ICommand {
  id: string;
  name: string;
  do(): void;
}

export class Command implements ICommand {
  id: string;
  name: string;
  doAction: Function;
  undoAction: Function;

  constructor(id: string, name: string, doAction: Function, undoAction?: Function) {
    this.id = id;
    this.name = name;
    this.doAction = doAction;
    this.undoAction = undoAction;
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
