import * as React from 'react';
import { IIssue } from '../../application';
import SidField from '../sid-field';

interface IIssueSidFieldProps {
  issue: IIssue;
  bold?: boolean;
}

interface IIssueSidFieldState {
}

export default class IssueSidField extends React.PureComponent<IIssueSidFieldProps, IIssueSidFieldState> {
  render() {
    return (
      <SidField sid={this.props.issue.sid} bold={this.props.bold} />
    );
  }
};
