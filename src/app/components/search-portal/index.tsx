import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ISearchController } from '../../search';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import SearchWindow from '../search-window';
import SearchCommand from './search-command';

interface ISearchPortalProps {
}

interface ISearchPortalState {
}

export default class SearchPortal extends React.Component<ISearchPortalProps, ISearchPortalState> implements ISearchController, ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowManager = ServiceManager.Instance.getWindowManager();
  private searchWindow: IWindow;

  constructor() {
    super();

    this.handleSearchWindowIssueSelect = this.handleSearchWindowIssueSelect.bind(this);

    this.state = {};
  }

  componentWillMount() {
    ServiceManager.Instance.setSearchController(this);
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
    ServiceManager.Instance.setSearchController(undefined);
  }

  showSearchWindow() {
    this.searchWindow = {
      content: <SearchWindow onIssueSelect={this.handleSearchWindowIssueSelect} />,
      top: 20,
      closeOnBlur: true,
      closeOnEsc: true,
    };

    this.windowManager.showWindow(this.searchWindow);
  }

  getCommands() {
    return [
      new SearchCommand(),
    ];
  }

  private handleSearchWindowIssueSelect(issue: IIssue) {
    this.windowManager.closeWindow(this.searchWindow);
    // TODO
  }

  render() {
    return (
      <div className="search-portal component">
      </div>
    );
  }
};
