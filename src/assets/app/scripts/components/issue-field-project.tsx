import * as React from 'react';
import { Nautilus, IProject, entityComparer } from '../nautilus';
import { IssueField } from './issue-field';

export class ProjectIssueField extends IssueField {
  getValue(): IProject {
    return this.props.issue.getProject();
  }

  getValues(): IProject[] {
    return Nautilus.Instance.getProjects();
  }

  valueToString(value: IProject): string {
    return value ? value.name : '';
  }

  valueFromString(value: string, values: IProject[]): IProject {
    return _.find(values, (x: IProject) => x.name.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IProject, value2: IProject): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IProject): void {
    Nautilus.Instance.updateIssue(this.props.issue, { project: value || null });
  }
};
