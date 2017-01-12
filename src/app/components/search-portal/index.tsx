import * as React from 'react';
import { IIssue } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import SearchModal from '../search-modal';
import SearchCommand from './search-command';

interface ISearchPortalProps {
}

interface ISearchPortalState {
  isSearchModalOpen?: boolean;
}

export default class SearchPortal extends React.Component<ISearchPortalProps, ISearchPortalState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleSearchCommandExecute = this.handleSearchCommandExecute.bind(this);
    this.handleSearchModalIssueSelect = this.handleSearchModalIssueSelect.bind(this);
    this.handleSearchModalCloseRequest = this.handleSearchModalCloseRequest.bind(this);

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
      isSearchModalOpen: true,
    });
  }

  private handleSearchModalIssueSelect(issue: IIssue) {
    this.setState({
      isSearchModalOpen: false,
    });
  }

  private handleSearchModalCloseRequest() {
    this.setState({
      isSearchModalOpen: false,
    });
  }

  render() {
    return (
      <div className="search-portal component">
        <SearchModal isOpen={this.state.isSearchModalOpen} onIssueSelect={this.handleSearchModalIssueSelect} onCloseRequest={this.handleSearchModalCloseRequest} />
      </div>
    );
  }
};
