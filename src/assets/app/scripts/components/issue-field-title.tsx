import * as React from 'react';
import { Nautilus } from '../nautilus';
import { IssueField } from './issue-field';

export class TitleIssueField extends IssueField {
  getValue(): string {
    return this.props.issue.getTitle();
  }

  getEditableSpanClassName(): string {
    var state = this.props.issue.getState();

    if (!state)
      return "";

    return "state-" + state.type;
  }

  setValue(value: string): void {
    Nautilus.Instance.updateIssue(this.props.issue, { title: value });
  }
};
