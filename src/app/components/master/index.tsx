import * as React from 'react';
import Header from '../header';
import Nav from '../nav';

require('./index.less');

interface IMasterProps {
}

interface IMasterState {
}

export default class Master extends React.Component<IMasterProps, IMasterState> {
  render() {
    return (
      <div className="master component">
        <div className="header">
          <Header />
        </div>
        <div className="nav">
          <Nav />
        </div>
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }
};
