import * as React from 'react';
import { Nautilus, IProject, IItemArea, entityComparer } from '../nautilus';
import { MilestoneField } from './milestone-field';

export class ProjectMilestoneField extends MilestoneField {
  getValue(): IProject {
    return this.props.milestone.getProject();
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
    var currentArea = this.props.milestone.getArea();
    var newArea: IItemArea = undefined;

    if (currentArea && currentArea.project && !entityComparer(currentArea.project, value))
      newArea = null;

    Nautilus.Instance.updateMilestone(this.props.milestone, { project: value || null, area: newArea });
  }
};
