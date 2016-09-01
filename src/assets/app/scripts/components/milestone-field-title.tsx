import * as React from 'react';
import { Nautilus } from '../nautilus';
import { MilestoneField } from './milestone-field';

export class TitleMilestoneField extends MilestoneField {
  getValue(): string {
    return this.props.milestone.getTitle();
  }

  setValue(value: string): void {
    Nautilus.Instance.updateMilestone(this.props.milestone, { title: value });
  }
};
