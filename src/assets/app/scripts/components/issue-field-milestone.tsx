import * as React from 'react';
import { Nautilus, IMilestone } from '../nautilus';
import { IssueField } from './issue-field';

export class MilestoneIssueField extends IssueField {
  getPlaceholder(): string {
    return "Milestone";
  }

  getValue(): IMilestone {
    return this.props.issue.getMilestone();
  }

  getValues(): IMilestone[] {
    return Nautilus.Instance.getMilestones();
  }

  valueToString(value: IMilestone, full: boolean) {
    if (!value)
      return '';

    if (full)
      return value.getFullTitle();

    return value.title;
  }

  valueFromString(value: string, values: IMilestone[]): IMilestone {
    return _.find(values, (x: IMilestone) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IMilestone, value2: IMilestone) {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IMilestone): void {
    Nautilus.Instance.updateIssue(this.props.issue, { parent: value || null });
  }
};
