import * as React from 'react';
import { Link, IndexLink } from 'react-router';
import Header from '../header';
import Nav from '../nav';

export default class Master extends React.Component<{}, {}> {
  render() {
    return (
      <div className="master">
        <Header />
        <Nav />
        <div>
          { this.props.children }
        </div>
      </div>
    );
  }
};
