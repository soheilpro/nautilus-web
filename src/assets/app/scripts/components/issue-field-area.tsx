import * as React from 'react';
import { Nautilus, IItemArea, entityComparer } from '../nautilus';
import { IssueField } from './issue-field';

export class AreaIssueField extends IssueField {
  getPlaceholder(): string {
    return "Select area";
  }

  getValue(): IItemArea {
    return this.props.issue.getArea();
  }

  getValues(): IItemArea[] {
    var project = this.props.issue.getProject();
    return Nautilus.Instance.getItemAreas().filter(itemArea => !itemArea.project || entityComparer(itemArea.project, project));
  }

  valueToString(value: IItemArea): string {
    return value ? value.title : '';
  }

  valueFromString(value: string, values: IItemArea[]): IItemArea {
    return _.find(values, (x: IItemArea) => x.title.toLowerCase() === value.toLowerCase());
  }

  valueComparer(value1: IItemArea, value2: IItemArea): boolean {
    return value1 && value2 && value1.id === value2.id;
  }

  setValue(value: IItemArea): void {
    Nautilus.Instance.updateIssue(this.props.issue, { area: value || null });
  }
};
