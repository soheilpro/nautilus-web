import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import Application from '../../application';

require('./index.less');

export default class Nav extends React.Component<{}, {}> {
  private application = Application.Instance;

  render() {
    let hasAdminPermission = this.application.getCurrentUserPermissions().some(permission => !permission.project && permission.name === 'admin');

    return (
      <div className="nav component">
        <IndexLink to="/" activeClassName="active">Issues</IndexLink>
        <Link to="/milestones" activeClassName="active">Milestones</Link>
        { hasAdminPermission ? <Link to="/projects" activeClassName="active">Projects</Link> : null }
      </div>
    );
  }
};
