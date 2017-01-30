import { IWindow } from './iwindow';

export interface IWindowManager {
  showWindow(window: IWindow, callback?: () => any): void;
  closeWindow(window: IWindow, callback?: () => any): void;
}
