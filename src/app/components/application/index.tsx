import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ISession } from '../../sdk';
import App from '../../app';
import Splash from '../splash';
import Login from '../login';
import Issues from '../issues';

export default class Application extends React.Component<{}, {}> {
  private app = App.Instance;

  constructor() {
    super();

    this.handleAppInitialize = this.handleAppInitialize.bind(this);
    this.handleAppLogIn = this.handleAppLogIn.bind(this);
    this.handleAppLoad = this.handleAppLoad.bind(this);

    this.state = {};
  }

  componentWillMount() {
    this.app.on('initialize', this.handleAppInitialize);
    this.app.on('login', this.handleAppLogIn);
    this.app.on('load', this.handleAppLoad);
  }

  componentWillUnmount() {
    this.app.off('initialize', this.handleAppInitialize);
    this.app.off('login', this.handleAppLogIn);
    this.app.off('load', this.handleAppLoad);
  }

  private handleAppInitialize() {
    this.forceUpdate();
  }

  private handleAppLogIn(session: ISession) {
    this.forceUpdate();
  }

  private handleAppLoad() {
    this.forceUpdate();
  }

  render() {
    if (!this.app.isInitialized())
      return <span />;

    if (!this.app.isLoggedIn())
      return <Login />;

    if (!this.app.isLoaded())
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
