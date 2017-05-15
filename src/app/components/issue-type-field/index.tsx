import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import ItemTypeField from '../item-type-field';

interface IIssueTypeFieldProps {
  issue: IIssue;
}

interface IIssueTypeFieldState {
}

export default class IssueTypeField extends React.PureComponent<IIssueTypeFieldProps, IIssueTypeFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const type = this.application.itemTypes.get(this.props.issue.type);

    return (
      <ItemTypeField itemType={type} className="issue-type-field-component" />
    );
  }
};
