import * as React from 'react';
import { IItemState } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueStateFieldProps {
  issueState: IItemState;
}

interface IIssueStateFieldState {
}

export default class IssueStateField extends React.Component<IIssueStateFieldProps, IIssueStateFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.issueState)
      return null;

    let issueState = this.application.itemStates.get(this.props.issueState);

    return (
      <div className="issue-state-field-component">
        {issueState.title}
      </div>
    );
  }
};
