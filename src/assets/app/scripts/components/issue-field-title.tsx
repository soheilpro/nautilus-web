import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class TitleIssueField extends IssueField {
  getValue() {
    return this.props.issue.getTitle();
  }

  getEditableSpanStyle() {
    var state = this.props.issue.getState();

    if (!state)
      return;

    return {
      backgroundColor: state.color
    };
  }

  setValue(value) {
    Nautilus.Instance.updateIssue(this.props.issue, { title: value });
  }
};
