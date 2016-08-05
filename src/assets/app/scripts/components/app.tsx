import * as React from 'react';
import { Nautilus } from '../nautilus';
import { Issues } from './issues';

interface AppState {
  isInitialized?;
  error?;
}

export class App extends React.Component<{}, AppState> {
  constructor() {
    super();

    this.state = {
      isInitialized: false,
    };
  }

  componentDidMount() {
    Nautilus.Instance.on('error', (error) => {
      this.setState({
        error: error
      });
    });

    Nautilus.Instance.on('init', () => {
      this.setState({
        isInitialized: true
      });
    });

    Nautilus.Instance.init();
  }

  render() {
    if (!this.state.isInitialized)
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
