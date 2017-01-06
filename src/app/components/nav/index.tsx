import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import { ServiceManager } from '../../services';

require('./index.less');

interface INavProps {
}

interface INavState {
}

export default class Nav extends React.Component<INavProps, INavState> {
  render() {
    return (
      <div className="nav component">
        <IndexLink to="/" activeClassName="active">Issues</IndexLink>
        <Link to="/milestones" activeClassName="active">Milestones</Link>
        <Link to="/projects" activeClassName="active">Projects</Link>
      </div>
    );
  }
};
