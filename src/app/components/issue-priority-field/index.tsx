import * as React from 'react';
import { IIssue } from '../../application';
import ItemPriorityField from '../item-priority-field';

interface IIssuePriorityFieldProps {
  issue: IIssue;
}

interface IIssuePriorityFieldState {
}

export default class IssuePriorityField extends React.PureComponent<IIssuePriorityFieldProps, IIssuePriorityFieldState> {
  render() {
    return (
      <ItemPriorityField itemPriority={this.props.issue.priority} className="issue-priority-field-component" />
    );
  }
};
