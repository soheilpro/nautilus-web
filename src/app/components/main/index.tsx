import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import CommandController from '../command-controller';
import ActionController from '../action-controller';
import IssueController from '../issue-controller';
import SearchController from '../search-controller';
import WindowController from '../window-controller';
import IssuesPage from '../issues-page';
import MilestonesPage from '../milestones-page';
import ProjectsPage from '../projects-page';
import ViewIssuesCommand from './view-issues-command';

interface IMainProps {
}

interface IMainState {
}

export default class Main extends React.PureComponent<IMainProps, IMainState> implements ICommandProvider {
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
      <div className="main-component rtl">
        <WindowController />
        <CommandController />
        <ActionController />
        <SearchController />
        <IssueController />
        <Router history={browserHistory}>
          <Route path="/" component={IssuesPage}/>
          <Route path="/milestones" component={MilestonesPage}/>
          <Route path="/projects" component={ProjectsPage}/>
        </Router>
      </div>
    );
  }
};
