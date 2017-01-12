import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import ViewIssuesCommand from './view-issues-command';
import IssuesPage from '../issues-page';
import MilestonesPage from '../milestones-page';
import ProjectsPage from '../projects-page';
import CommandsPortal from '../commands-portal';
import IssuesPortal from '../issues-portal';
import SearchPortal from '../search-portal';

interface IMainProps {
}

interface IMainState {
}

export default class Main extends React.Component<IMainProps, IMainState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new ViewIssuesCommand(),
    ];
  }

  render() {
    return (
      <div>
        <Router history={browserHistory}>
          <Route path="/" component={IssuesPage}/>
          <Route path="/milestones" component={MilestonesPage}/>
          <Route path="/projects" component={ProjectsPage}/>
        </Router>
        <CommandsPortal />
        <SearchPortal />
        <IssuesPortal />
      </div>
    );
  }
};
