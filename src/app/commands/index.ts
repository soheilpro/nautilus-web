export interface ICommand {
  id: string;
  name: string;
  hidden: boolean;
  do(): void;
}

export class Command implements ICommand {
  id: string;
  name: string;
  hidden: boolean;
  doAction: Function;

  constructor(options: {id: string, name: string, doAction: Function, hidden?: boolean}) {
    this.id = options.id;
    this.name = options.name;
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

export interface ICommandManager {
  registerCommandProvider(commandProvider: ICommandProvider): void;
  unregisterCommandProvider(commandProvider: ICommandProvider): void;
  getCommands(): ICommand[];
  getCommand(id: string): ICommand;
}

export default class CommandManager implements ICommandManager {
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

  getCommand(id: string): ICommand {
    for (let commandProvider of this.commandProviders)
      for (let command of commandProvider.getCommands())
        if (command.id === id)
        return command;

    return null;
  }
}
