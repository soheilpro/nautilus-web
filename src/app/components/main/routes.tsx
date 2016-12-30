import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import Issues from '../issues';
import Milestones from '../milestones';
import Projects from '../projects';

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
        <Route path="/" component={Issues}/>
        <Route path="/milestones" component={Milestones}/>
        <Route path="/projects" component={Projects}/>
      </Router>
    );
  }
}
