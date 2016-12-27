import { ICommand } from './icommand';

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
