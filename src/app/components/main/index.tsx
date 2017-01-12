import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
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

export default class Main extends React.Component<IMainProps, IMainState> {
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
