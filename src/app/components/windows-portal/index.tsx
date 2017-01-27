import * as React from 'react';
import { ServiceManager } from '../../services';
import { IWindow, IWindowManager } from '../../windows';

interface IExtendedWindow extends IWindow {
  key?: number;
  zIndex?: number;
}

require('./index.less');

interface IWindowsPortalProps {
}

interface IWindowsPortalState {
  windows?: IExtendedWindow[];
}

export default class WindowsPortal extends React.Component<IWindowsPortalProps, IWindowsPortalState> implements IWindowManager {
  private lastKey = 0;
  private lastZIndex = 1000;

  constructor() {
    super();

    this.state = {
      windows: [],
    };
  }

  componentWillMount() {
    ServiceManager.Instance.setWindowManager(this);
  }

  componentWillUnmount() {
    ServiceManager.Instance.setWindowManager(undefined);
  }

  showWindow(window: IWindow) {
    let extendedWindow: IExtendedWindow = window;
    extendedWindow.key = this.lastKey++;
    extendedWindow.zIndex = this.lastZIndex++;
    extendedWindow.top = extendedWindow.top || 120;
    extendedWindow.width = extendedWindow.width || 600;

    this.setState(state => ({
      windows: state.windows.concat(extendedWindow),
    }));
  }

  closeWindow(window: any) {
    this.setState(state => ({
      windows: state.windows.filter(x => x !== window),
    }));
  }

  render() {
    return (
      <div className="windows-portal component">
      {
        this.state.windows.map((window, index) => {
          return (
            <div className="window-container" style={{ top: window.top, left: `calc(100% / 2 - ${window.width}px / 2)`, width: window.width, zIndex: window.zIndex }} key={window.key} tabIndex={0}>
              {window.content}
            </div>
          );
        })
      }
      </div>
    );
  }
};
