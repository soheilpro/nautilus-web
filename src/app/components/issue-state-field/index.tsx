import * as React from 'react';
import { IIssue } from '../../application';
import { ServiceManager } from '../../services';
import ItemStateField from '../item-state-field';

interface IIssueStateFieldProps {
  issue: IIssue;
}

interface IIssueStateFieldState {
}

export default class IssueStateField extends React.PureComponent<IIssueStateFieldProps, IIssueStateFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    const state = this.application.itemStates.get(this.props.issue.state);

    return (
      <ItemStateField itemState={state} className="issue-state-field-component" />
    );
  }
};
