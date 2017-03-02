import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import CommandController from '../command-controller';
import IssueController from '../issue-controller';
import SearchController from '../search-controller';
import TaskController from '../task-controller';
import WindowController from '../window-controller';
import IssuesPage from '../issues-page';
import MilestonesPage from '../milestones-page';
import ProjectsPage from '../projects-page';
import ViewIssuesCommand from './view-issues-command';

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
        <WindowController />
        <CommandController />
        <SearchController />
        <IssueController />
        <TaskController />
        <Router history={browserHistory}>
          <Route path="/" component={IssuesPage}/>
          <Route path="/milestones" component={MilestonesPage}/>
          <Route path="/projects" component={ProjectsPage}/>
        </Router>
      </div>
    );
  }
};
