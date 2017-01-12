import * as React from 'react';
import Header from '../header';
import Navigation from '../navigation';

require('./index.less');

interface IMasterPageProps {
}

interface IMasterPageState {
}

export default class MasterPage extends React.Component<IMasterPageProps, IMasterPageState> {
  render() {
    return (
      <div className="master-page component">
        <div className="header">
          <Header />
        </div>
        <div className="navigation">
          <Navigation />
        </div>
        <div className="content">
          { this.props.children }
        </div>
      </div>
    );
  }
};
