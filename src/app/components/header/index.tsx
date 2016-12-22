import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import App from '../../app';
import Avatar from '../avatar';

require('./index.less');

export default class Header extends React.Component<{}, {}> {
  private app = App.Instance;

  render() {
    let user = this.app.getUser(this.app.getCurrentUser());

    return (
      <div className="header row">
        <div className="main pull-left">
          <a href="/" className="title">nautilus</a>
        </div>
        <div className="profile pull-right">
          <Avatar user={user} size={30} />
        </div>
      </div>
    );
  }
};
