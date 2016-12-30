import * as React from 'react';

require ('./search-guide.less');

interface ISearchGuideProps {
}

interface ISearchGuideState {
}

export default class SearchGuide extends React.Component<ISearchGuideProps, ISearchGuideState> {
  render() {
    return (
      <div className="search-guide component">
        <div className="header">Examples:</div>
        <div className="example">
          <div className="query">api</div>
          <div className="description">Find issues containing 'api'.</div>
        </div>
        <div className="example">
          <div className="query">#1234</div>
          <div className="description">Find issue number 1234.</div>
        </div>
      </div>
    );
  }
}
