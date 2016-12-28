import * as React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { ISession } from '../../application';
import { ServiceManager } from '../../services';
import Login from '../login';
import Main from '../main';
import Splash from '../splash';

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

    return <Main />;
  }
};
