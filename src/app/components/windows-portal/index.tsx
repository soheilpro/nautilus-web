import * as _ from 'underscore';
import * as React from 'react';
import { KeyCode } from '../../keyboard';
import { ServiceManager } from '../../services';
import { IWindow, IWindowController } from '../../windows';

interface IExtendedWindow extends IWindow {
  key?: number;
  zIndex?: number;
  containerElement?: HTMLElement;
  focusedElement?: HTMLElement;
  elementToFocusOnClose?: HTMLElement;
}

require('./index.less');

interface IWindowsPortalProps {
}

interface IWindowsPortalState {
  windows?: IExtendedWindow[];
  elementToFocus?: HTMLElement;
}

export default class WindowsPortal extends React.Component<IWindowsPortalProps, IWindowsPortalState> implements IWindowController {
  private lastKey = 0;
  private lastZIndex = 1000;

  constructor() {
    super();

    this.handleOverlayFocus = this.handleOverlayFocus.bind(this);
    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleContainerFocus = this.handleContainerFocus.bind(this);
    this.handleContainerBlur = this.handleContainerBlur.bind(this);

    this.state = {
      windows: [],
    };
  }

  componentWillMount() {
    ServiceManager.Instance.setWindowController(this);
  }

  componentDidUpdate() {
    if (this.state.elementToFocus)
      this.state.elementToFocus.focus();
  }

  componentWillUnmount() {
    ServiceManager.Instance.setWindowController(undefined);
  }

  showWindow(window: IWindow, callback?: () => any) {
    let extendedWindow: IExtendedWindow = window;
    extendedWindow.key = this.lastKey++;
    extendedWindow.zIndex = this.lastZIndex++;
    extendedWindow.top = extendedWindow.top || 120;
    extendedWindow.width = extendedWindow.width || 600;
    extendedWindow.closeOnBlur = extendedWindow.closeOnBlur || window.modal;
    extendedWindow.closeOnEsc = extendedWindow.closeOnEsc || window.modal;
    extendedWindow.elementToFocusOnClose = document.activeElement as HTMLElement;

    this.setState(state => ({
      windows: state.windows.concat(extendedWindow),
      elementToFocus: null,
    }), callback);
  }

  closeWindow(window: IExtendedWindow, callback?: () => any) {
    this.setState(state => ({
      windows: state.windows.filter(x => x !== window),
      elementToFocus: window.elementToFocusOnClose,
    }), callback);
  }

  private handleOverlayFocus(window: IExtendedWindow, event: React.FocusEvent<HTMLDivElement>) {
    window.focusedElement.focus();
  }

  private handleContainerKeyDown(window: IExtendedWindow, event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.Escape) {
      event.preventDefault();

      if (window.closeOnEsc)
        this.closeWindow(window);
    }
  }

  private handleContainerFocus(window: IExtendedWindow, event: React.FocusEvent<HTMLDivElement>) {
    window.focusedElement = event.target as HTMLElement;
  }

  private handleContainerBlur(window: IExtendedWindow, event: React.FocusEvent<HTMLDivElement>) {
    if (!window.closeOnBlur)
      return;

    setTimeout(() => {
      if (window.containerElement.contains(document.activeElement))
        return;

      this.closeWindow(window);
    }, 0);
  }

  render() {
    return (
      <div className="windows-portal component">
      {
        this.state.windows.map((window, index) => {
          return (
            <div key={window.key}>
              {
                window.modal ?
                  <div className="overlay" tabIndex={0} onFocus={_.partial(this.handleOverlayFocus, window)}></div>
                  : null
              }
              <div className="window-container" style={{ top: window.top, left: `calc(100% / 2 - ${window.width}px / 2)`, width: window.width, zIndex: window.zIndex }} tabIndex={0} onKeyDown={_.partial(this.handleContainerKeyDown, window)} onFocus={_.partial(this.handleContainerFocus, window)} onBlur={_.partial(this.handleContainerBlur, window)} ref={e => window.containerElement = e}>
                {window.content}
              </div>
            </div>
          );
        })
      }
      </div>
    );
  }
};
