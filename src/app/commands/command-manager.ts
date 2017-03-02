import { ICommand } from './icommand';
import { ICommandManager } from './icommand-manager';
import { ICommandProvider } from './icommand-provider';

export class CommandManager implements ICommandManager {
  private commandProviders: ICommandProvider[] = [];

  registerCommandProvider(commandProvider: ICommandProvider) {
    this.commandProviders.push(commandProvider);
  }

  unregisterCommandProvider(commandProvider: ICommandProvider) {
    const index = this.commandProviders.indexOf(commandProvider);
    this.commandProviders.splice(index, 1);
  }

  getCommands() {
    const commands: ICommand[] = [];

    for (const commandProvider of this.commandProviders)
      for (const command of commandProvider.getCommands())
        if (command)
          commands.push(command);

    return commands;
  }
}
