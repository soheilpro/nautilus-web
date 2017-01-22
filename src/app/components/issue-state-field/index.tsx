import * as React from 'react';
import { IIssueState } from '../../application';
import { ServiceManager } from '../../services';

require('./index.less');

interface IIssueStateFieldProps {
  issueState: IIssueState;
}

interface IIssueStateFieldState {
}

export default class IssueStateField extends React.Component<IIssueStateFieldProps, IIssueStateFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.issueState)
      return null;

    let issueState = this.application.issueStates.get(this.props.issueState);

    return (
      <div className="issue-state-field component">
        {issueState.title}
      </div>
    );
  }
};
