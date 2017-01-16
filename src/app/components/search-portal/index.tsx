import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import SearchWindow from '../search-window';
import SearchCommand from './search-command';

interface ISearchPortalProps {
}

interface ISearchPortalState {
  isSearchWindowOpen?: boolean;
}

export default class SearchPortal extends React.Component<ISearchPortalProps, ISearchPortalState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();

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
    this.setState({
      isSearchWindowOpen: true,
    });
  }

  private handleSearchWindowIssueSelect(issue: IIssue) {
    this.setState({
      isSearchWindowOpen: false,
    });
  }

  private handleSearchWindowCloseRequest() {
    this.setState({
      isSearchWindowOpen: false,
    });
  }

  render() {
    return (
      <div className="search-portal component">
        <SearchWindow isOpen={this.state.isSearchWindowOpen} onIssueSelect={this.handleSearchWindowIssueSelect} onCloseRequest={this.handleSearchWindowCloseRequest} />
      </div>
    );
  }
};
