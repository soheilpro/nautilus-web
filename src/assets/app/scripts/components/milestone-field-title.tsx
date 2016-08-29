import * as React from 'react';
import { Nautilus } from '../nautilus';
import { MilestoneField } from './milestone-field';

export class TitleMilestoneField extends MilestoneField {
  getValue(): string {
    return this.props.milestone.getTitle();
  }

  getEditableSpanClassName(): string {
    var state = this.props.milestone.getState();

    if (!state)
      return "";

    return "state-" + state.type;
  }

  setValue(value: string): void {
    Nautilus.Instance.updateMilestone(this.props.milestone, { title: value });
  }
};
