import * as React from 'react';
import App from '../../app';

interface ILoginState {
  username?: string;
  password?: string;
  error?: string;
}

export default class Login extends React.Component<{}, ILoginState> {
  constructor() {
    super();

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      username: '',
      password: ''
    };
  }

  private handleUsernameChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({
      username: (event.target as HTMLInputElement).value
    });
  }

  private handlePasswordChange(event: React.FormEvent<HTMLInputElement>) {
    this.setState({
      password: (event.target as HTMLInputElement).value
    });
  }

  private async handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (this.state.username.trim().length === 0) {
      return this.setState({
        error:  'Plese enter your username.'
      });
    }

    if (this.state.password.trim().length === 0) {
      return this.setState({
        error:  'Plese enter your password.'
      });
    }

    let session = await App.Instance.createSession(this.state.username, this.state.password);

    if (!session) {
      this.setState({
        error: 'Wrong username and/or password.'
      });
    }
  }

  render() {
    return (
      <div className="container">
          <div className="row">
              <div className="four columns">&nbsp;</div>
              <div style={{ marginTop: '20vh' }} className="four columns">
                  <h1 style={{ textAlign: 'center' }}>App</h1>
                  <br />
                  <form onSubmit={this.handleSubmit}>
                      {
                        this.state.error ?
                          <div className="row bottom-margin" style={{textAlign: 'center'}}>
                            <span className="validation-error">{this.state.error}</span>
                          </div>
                          : null
                      }
                      <div className="row bottom-margin">
                        <input name="username" type="text" placeholder="Username" className="u-full-width" value={this.state.username} onChange={this.handleUsernameChange} />
                      </div>
                      <div className="row bottom-margin">
                        <input name="password" type="password" placeholder="Password" className="u-full-width" value={this.state.password} onChange={this.handlePasswordChange} />
                      </div>
                      <div className="row">
                        <button type="submit" className="button-primary u-full-width">Log In</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
    );
  }
};
