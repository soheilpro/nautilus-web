import * as React from 'react';

require('../../assets/stylesheets/base.less');
require('./table-header.less');

interface ITableHeaderProps {
}

interface ITableHeaderState {
}

export default class TableHeader extends React.PureComponent<ITableHeaderProps, ITableHeaderState> {
  render() {
    return (
      <div className="table-header-component table-header">
        <div className="table-cell sid">#</div>
        <div className="table-cell title">Title</div>
        <div className="table-cell project">Project</div>
        <div className="table-cell type">Type</div>
        <div className="table-cell priority">Priority</div>
        <div className="table-cell state">State</div>
        <div className="table-cell assigned-to">Assigned To</div>
        <div className="table-cell milestone">Milestone</div>
      </div>
    );
  }
};
