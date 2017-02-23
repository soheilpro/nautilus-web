import * as _ from 'underscore';
import * as React from 'react';
import { ServiceManager } from '../../services';
import { IWindow, IWindowController } from '../../windows';
import { WindowContainer } from '../window';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IExtendedWindow extends IWindow {
  key?: number;
  focusedElementOnOpen?: HTMLElement;
}

interface IWindowControllerProps {
}

interface IWindowControllerState {
  windows?: IExtendedWindow[];
}

export default class WindowController extends React.Component<IWindowControllerProps, IWindowControllerState> implements IWindowController {
  private windowKeyCounter = 0;
  private elementToFocus?: HTMLElement;

  private get commandController() {
    return ServiceManager.Instance.getCommandController();
  }

  constructor() {
    super();

    this.handleWindowContainerCloseRequest = this.handleWindowContainerCloseRequest.bind(this);

    this.state = {
      windows: [],
    };
  }

  componentWillMount() {
    ServiceManager.Instance.setWindowController(this);
  }

  componentDidUpdate() {
    if (this.elementToFocus)
      this.elementToFocus.focus();
  }

  componentWillUnmount() {
    ServiceManager.Instance.setWindowController(undefined);
  }

  showWindow(window: IWindow, callback?: () => any) {
    let extendedWindow: IExtendedWindow = window;
    extendedWindow.key = this.windowKeyCounter++;
    extendedWindow.focusedElementOnOpen = document.activeElement as HTMLElement;

    this.elementToFocus = null;

    this.setState(state => ({
      windows: state.windows.concat(extendedWindow),
    }), callback);

    if (window.modal)
      this.commandController.disableCommandShortcuts();
  }

  closeWindow(window: IExtendedWindow, callback?: () => any) {
    this.elementToFocus = window.focusedElementOnOpen;

    this.setState(state => ({
      windows: state.windows.filter(x => x !== window),
    }), callback);

    if (window.modal)
      this.commandController.enableCommandShortcuts();
  }

  private handleWindowContainerCloseRequest(window: IExtendedWindow) {
    this.closeWindow(window);
  }

  render() {
    return (
      <div className="window-controller-component">
      {
        this.state.windows.map((window, index) => {
          return (
            <div key={window.key}>
              {
                window.modal &&
                  <div className="overlay"></div>
              }
              <WindowContainer top={window.top} width={window.width} onCloseRequest={_.partial(this.handleWindowContainerCloseRequest, window)} >
                {window.content}
              </WindowContainer>
            </div>
          );
        })
      }
      </div>
    );
  }
};