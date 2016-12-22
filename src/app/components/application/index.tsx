import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ISession } from '../../sdk';
import App from '../../app';
import Loading from './loading';
import Login from '../login';
import Issues from '../issues';

export default class Application extends React.Component<{}, {}> {
  constructor() {
    super();

    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleInitialized = this.handleInitialized.bind(this);
    this.handleLoaded = this.handleLoaded.bind(this);

    this.state = {};
  }

  componentWillMount() {
    App.Instance.on('initialized', this.handleInitialized);
    App.Instance.on('login', this.handleLogIn);
    App.Instance.on('loaded', this.handleLogIn);
  }

  componentWillUnmount() {
    App.Instance.off('initialized', this.handleInitialized);
    App.Instance.off('login', this.handleLogIn);
    App.Instance.off('loaded', this.handleLogIn);
  }

  private handleInitialized() {
    this.forceUpdate();
  }

  private handleLogIn(session: ISession) {
    this.forceUpdate();
  }

  private handleLoaded() {
    this.forceUpdate();
  }

  render() {
    if (!App.Instance.isInitialized())
      return (
        <span />
      );

    if (!App.Instance.getSession())
      return (
        <Login />
      );

    if (!App.Instance.isLoaded())
      return (
        <Loading />
      );

    return (
      <Router history={browserHistory}>
          <Route path="/" component={Issues}/>
      </Router>
    );
  }
};
