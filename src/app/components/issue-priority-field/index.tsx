import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import ItemPriorityField from '../item-priority-field';

interface IIssuePriorityFieldProps {
  issue: IIssue;
}

interface IIssuePriorityFieldState {
}

export default class IssuePriorityField extends React.PureComponent<IIssuePriorityFieldProps, IIssuePriorityFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const priority = this.application.itemPriorities.get(this.props.issue.priority);

    return (
      <ItemPriorityField itemPriority={priority} className="issue-priority-field-component" />
    );
  }
};
