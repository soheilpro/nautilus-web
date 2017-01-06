import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import { ServiceManager } from '../../services';
import Avatar from '../avatar';

require('./index.less');

interface IHeaderProps {
}

interface IHeaderState {
}

export default class Header extends React.Component<IHeaderProps, IHeaderState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    let user = this.application.getSession().user;

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
