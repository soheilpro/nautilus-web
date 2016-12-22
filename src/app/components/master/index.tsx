import * as React from 'react';
import Header from '../header';
import Nav from '../nav';

export default class Master extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <Header />
        <Nav />
        { this.props.children }
      </div>
    );
  }
};
