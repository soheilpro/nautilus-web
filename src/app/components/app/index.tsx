import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ISession } from '../../application';
import ServiceManager from '../../service-manager';
import Splash from '../splash';
import Login from '../login';
import Issues from '../issues';

export default class App extends React.Component<{}, {}> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleApplicationInitialize = this.handleApplicationInitialize.bind(this);
    this.handleApplicationLogIn = this.handleApplicationLogIn.bind(this);
    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.application.on('initialize', this.handleApplicationInitialize);
    this.application.on('login', this.handleApplicationLogIn);
    this.application.on('load', this.handleApplicationLoad);
  }

  componentWillUnmount() {
    this.application.off('initialize', this.handleApplicationInitialize);
    this.application.off('login', this.handleApplicationLogIn);
    this.application.off('load', this.handleApplicationLoad);
  }

  private handleApplicationInitialize() {
    this.forceUpdate();
  }

  private handleApplicationLogIn(session: ISession) {
    this.forceUpdate();
  }

  private handleApplicationLoad() {
    this.forceUpdate();
  }

  render() {
    if (!this.application.isInitialized())
      return <span />;

    if (!this.application.isLoggedIn())
      return <Login />;

    if (!this.application.isLoaded())
      return <Splash />;

    return (
      <Router history={browserHistory}>
        <Route path="/" component={Issues}/>
        <Route path="/milestones" component={Issues}/>
        <Route path="/projects" component={Issues}/>
      </Router>
    );
  }
};
