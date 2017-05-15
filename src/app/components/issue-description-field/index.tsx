import * as React from 'react';
import { IIssue } from '../../application';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueDescriptionFieldProps {
  issue: IIssue;
}

interface IIssueDescriptionFieldState {
}

export default class IssueDescriptionField extends React.PureComponent<IIssueDescriptionFieldProps, IIssueDescriptionFieldState> {
  render() {
    return (
      <span className="issue-description-field-component">
        {this.props.issue.description}
      </span>
    );
  }
};
