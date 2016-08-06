import * as React from 'react';
import { Nautilus } from '../nautilus';

export class Login extends React.Component<{}, {}> {
  private usernameElement;
  private passwordElement;

  onSubmit(e) {
    e.preventDefault()

    var username = $(this.usernameElement).val();
    var password = $(this.passwordElement).val();

    Nautilus.Instance.login(username, password);
  }

  render() {
    return (
        <div className="container">
            <div className="row">
                <div className="four columns">&nbsp;</div>
                <div style={{marginTop: '20vh'}} className="four columns">
                    <h1 style={{textAlign: 'center'}}>Nautilus</h1>
                    <br />
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <div className="row"><input name="username" type="text" placeholder="Username" className="u-full-width" ref={(ref) => this.usernameElement = ref} /></div>
                        <div className="row"><input name="password" type="password" placeholder="Password" className="u-full-width" ref={(ref) => this.passwordElement = ref} /></div>
                        <div className="row"><button type="submit" className="button-primary u-full-width">Log In</button></div>
                    </form>
                </div>
            </div>
        </div>
    );
  }
};
