import * as React from 'react';
import { Nautilus } from '../nautilus';
import { MilestoneField } from './milestone-field';

export class SidMilestoneField extends MilestoneField {
  getValue(): string {
    return this.props.milestone.sid;
  }

  isEditable(): boolean {
    return false;
  }
};
