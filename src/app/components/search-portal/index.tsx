import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import SearchWindow from '../search-window';
import SearchCommand from './search-command';

interface ISearchPortalProps {
}

interface ISearchPortalState {
}

export default class SearchPortal extends React.Component<ISearchPortalProps, ISearchPortalState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowManager = ServiceManager.Instance.getWindowManager();
  private searchWindow: IWindow;

  constructor() {
    super();

    this.handleSearchCommandExecute = this.handleSearchCommandExecute.bind(this);
    this.handleSearchWindowIssueSelect = this.handleSearchWindowIssueSelect.bind(this);
    this.handleSearchWindowCloseRequest = this.handleSearchWindowCloseRequest.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new SearchCommand(this.handleSearchCommandExecute),
    ];
  }

  private handleSearchCommandExecute() {
    this.searchWindow = {
      content: <SearchWindow onIssueSelect={this.handleSearchWindowIssueSelect} onCloseRequest={this.handleSearchWindowCloseRequest} />,
      top: 20,
    };

    this.windowManager.showWindow(this.searchWindow);
  }

  private handleSearchWindowIssueSelect(issue: IIssue) {
    // TODO

    this.windowManager.closeWindow(this.searchWindow);
  }

  private handleSearchWindowCloseRequest() {
    this.windowManager.closeWindow(this.searchWindow);
  }

  render() {
    return (
      <div className="search-portal component">
      </div>
    );
  }
};
