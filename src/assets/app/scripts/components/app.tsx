import * as React from 'react';
import { Nautilus, ISession } from '../nautilus';
import { Login } from './login';
import { Issues } from './issues';

interface AppState {
  error?: any;
}

export class App extends React.Component<{}, AppState> {
  constructor() {
    super();

    this.state = {};
  }

  componentWillMount() {
    Nautilus.Instance.on('error', (error: Error) => {
      this.setState({
        error: error
      });
    });

    Nautilus.Instance.on('login', (session: ISession) => {
      Nautilus.Instance.setSession(session);
      Nautilus.Instance.init();
      this.saveSession(session);
      this.forceUpdate();
    });

    Nautilus.Instance.on('init', () => {
      this.forceUpdate();
    });

    var session = this.loadSession();

    if (session) {
      Nautilus.Instance.setSession(session);
      Nautilus.Instance.init();
    }
  }

  loadSession(): ISession {
    var item = localStorage.getItem('session');

    if (!item)
      return item;

    return JSON.parse(item);
  }

  saveSession(session: ISession) {
    localStorage.setItem('session', JSON.stringify(session));
  }

  render() {
    if (!Nautilus.Instance.getSession())
      return (
        <Login />
      );

    if (!Nautilus.Instance.isInitialized())
      return <span>Loading...</span>;

    if (this.state.error)
      return (
        <div>
          <div>Error!</div>
          <div>{this.state.error.toString()}</div>
          <div>{this.state.error.stack}</div>
        </div>
      );

    return (
      <Issues />
    );
  }
};
