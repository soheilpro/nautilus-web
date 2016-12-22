import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import Application from '../../application';
import Avatar from '../avatar';

require('./index.less');

export default class Header extends React.Component<{}, {}> {
  private application = Application.Instance;

  render() {
    let user = this.application.getUser(this.application.getCurrentUser());

    return (
      <div className="header component">
        <div className="row">
          <div className="main pull-left">
            <a href="/" className="title">nautilus</a>
          </div>
          <div className="profile pull-right">
            <Avatar user={user} size={30} />
          </div>
        </div>
      </div>
    );
  }
};
