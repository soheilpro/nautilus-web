export interface ICommand {
  id: string;
  name: string;
  hidden: boolean;
  do(): void;
}
