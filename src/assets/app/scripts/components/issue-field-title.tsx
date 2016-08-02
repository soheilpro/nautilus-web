import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class TitleIssueField extends IssueField {
  getItem() {
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

  onChanged(value) {
    Nautilus.Instance.updateIssue(this.props.issue, { title: value });
  }
};
