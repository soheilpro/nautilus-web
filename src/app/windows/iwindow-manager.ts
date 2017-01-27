import { IWindow } from './iwindow';

export interface IWindowManager {
  showWindow(window: IWindow): void;
  closeWindow(window: IWindow): void;
}
