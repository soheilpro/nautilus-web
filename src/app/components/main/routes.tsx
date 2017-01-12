import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import IssuesPage from '../issues-page';
import MilestonesPage from '../milestones-page';
import ProjectsPage from '../projects-page';

interface IRoutesProps {
}

interface IRoutesState {
}

export default class Routes extends React.Component<IRoutesProps, IRoutesState> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={IssuesPage}/>
        <Route path="/milestones" component={MilestonesPage}/>
        <Route path="/projects" component={ProjectsPage}/>
      </Router>
    );
  }
}
