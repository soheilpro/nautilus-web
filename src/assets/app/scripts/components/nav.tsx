import * as React from 'react';
import { Nautilus } from '../nautilus';

var Link = ReactRouter.Link;
var IndexLink = ReactRouter.IndexLink;

export class Nav extends React.Component<{}, {}> {
  render() {
    var hasAdminPermission = Nautilus.Instance.getPermissions().some(permission => !permission.project && permission.name === 'admin');

    return (
        <div className='row nav'>
          <div className='columns'>
            <IndexLink to="/" activeClassName="active">Issues</IndexLink>
            <Link to="/milestones" activeClassName="active">Milestones</Link>
            { hasAdminPermission ? <Link to="/projects" activeClassName="active">Projects</Link> : null }
          </div>
        </div>
    );
  }
};
