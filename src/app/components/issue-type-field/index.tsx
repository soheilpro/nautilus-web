import * as React from 'react';
import { IItemType } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueTypeFieldProps {
  issueType: IItemType;
}

interface IIssueTypeFieldState {
}

export default class IssueTypeField extends React.Component<IIssueTypeFieldProps, IIssueTypeFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.issueType)
      return null;

    let issueType = this.application.itemTypes.get(this.props.issueType);

    return (
      <div className="issue-type-field-component">
        {issueType.title}
      </div>
    );
  }
};
