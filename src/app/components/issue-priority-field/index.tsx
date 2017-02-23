import * as React from 'react';
import { IItemPriority } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssuePriorityFieldProps {
  issuePriority: IItemPriority;
}

interface IIssuePriorityFieldState {
}

export default class IssuePriorityField extends React.Component<IIssuePriorityFieldProps, IIssuePriorityFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.issuePriority)
      return null;

    let issuePriority = this.application.itemPriorities.get(this.props.issuePriority);

    return (
      <div className="issue-priority-field-component">
        {issuePriority.title}
      </div>
    );
  }
};
