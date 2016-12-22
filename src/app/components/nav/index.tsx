import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import App from '../../app';

require('./index.less');

export default class Nav extends React.Component<{}, {}> {
  private app = App.Instance;

  render() {
    let hasAdminPermission = this.app.getCurrentUserPermissions().some(permission => !permission.project && permission.name === 'admin');

    return (
      <div className="row nav">
        <div className="columns">
          <IndexLink to="/" activeClassName="active">Issues</IndexLink>
          <Link to="/milestones" activeClassName="active">Milestones</Link>
          { hasAdminPermission ? <Link to="/projects" activeClassName="active">Projects</Link> : null }
        </div>
      </div>
    );
  }
};
