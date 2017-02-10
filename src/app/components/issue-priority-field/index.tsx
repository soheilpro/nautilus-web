import * as React from 'react';
import { IIssuePriority } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssuePriorityFieldProps {
  issuePriority: IIssuePriority;
}

interface IIssuePriorityFieldState {
}

export default class IssuePriorityField extends React.Component<IIssuePriorityFieldProps, IIssuePriorityFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.issuePriority)
      return null;

    let issuePriority = this.application.issuePriorities.get(this.props.issuePriority);

    return (
      <div className="issue-priority-field-component">
        {issuePriority.title}
      </div>
    );
  }
};
