import * as React from 'react';
import { ServiceManager } from '../../services';

require('./index.less');

interface ILoginProps {
}

interface ILoginState {
  username?: string;
  password?: string;
  error?: string;
}

export default class Login extends React.Component<ILoginProps, ILoginState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

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

  private async handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    let session = await this.application.logIn(this.state.username, this.state.password);

    if (!session) {
      this.setState({
        error: 'Wrong username and/or password.'
      });
    }
  }

  render() {
    return (
      <div className="login component">
        <div className="container">
            <div className="title">nautilus</div>
            <form onSubmit={this.handleFormSubmit}>
                {
                  this.state.error ?
                    <div className="row" style={{textAlign: 'center'}}>
                      <span className="validation-error">{this.state.error}</span>
                    </div>
                    : null
                }
                <div className="row">
                  <input type="text" placeholder="Username" className="full-width" value={this.state.username} onChange={this.handleUsernameChange} />
                </div>
                <div className="row">
                  <input type="password" placeholder="Password" className="full-width" value={this.state.password} onChange={this.handlePasswordChange} />
                </div>
                <div className="row">
                  <button type="submit" className="full-width">Log In</button>
                </div>
            </form>
          </div>
      </div>
    );
  }
};
