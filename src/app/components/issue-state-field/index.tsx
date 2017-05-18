import * as React from 'react';
import { IIssue } from '../../application';
import ItemStateField from '../item-state-field';

interface IIssueStateFieldProps {
  issue: IIssue;
}

interface IIssueStateFieldState {
}

export default class IssueStateField extends React.PureComponent<IIssueStateFieldProps, IIssueStateFieldState> {
  render() {
    return (
      <ItemStateField itemState={this.props.issue.state} className="issue-state-field-component" />
    );
  }
};
