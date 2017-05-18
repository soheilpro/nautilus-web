import * as React from 'react';
import { IIssue } from '../../application';
import ItemTypeField from '../item-type-field';

interface IIssueTypeFieldProps {
  issue: IIssue;
}

interface IIssueTypeFieldState {
}

export default class IssueTypeField extends React.PureComponent<IIssueTypeFieldProps, IIssueTypeFieldState> {
  render() {
    return (
      <ItemTypeField itemType={this.props.issue.type} className="issue-type-field-component" />
    );
  }
};
