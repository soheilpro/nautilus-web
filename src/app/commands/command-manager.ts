import { ICommand } from './icommand';
import { ICommandManager } from './icommand-manager';
import { ICommandProvider } from './icommand-provider';

export class CommandManager implements ICommandManager {
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
        if (!command.isDisabled)
          commands.push(command);

    return commands;
  }
}
