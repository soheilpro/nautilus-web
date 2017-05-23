import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./header.less');

interface IHeaderProps {
}

interface IHeaderState {
}

export default class Header extends React.PureComponent<IHeaderProps, IHeaderState> {
  render() {
    return (
      <div className="header-component list-header">
        <div className="list-header-field sid">#</div>
        <div className="list-header-field title">Title</div>
        <div className="list-header-field project">Project</div>
        <div className="list-header-field type">Type</div>
        <div className="list-header-field priority">Priority</div>
        <div className="list-header-field state">State</div>
        <div className="list-header-field assigned-to">Assigned To</div>
        <div className="list-header-field milestone">Milestone</div>
      </div>
    );
  }
};
