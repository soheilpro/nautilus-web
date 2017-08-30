export interface IAction {
  execute(): Promise<void>;
  undo(): Promise<void>;
}
