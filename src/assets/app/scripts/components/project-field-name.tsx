import * as React from 'react';
import { Nautilus } from '../nautilus';
import { ProjectField } from './project-field';

export class NameProjectField extends ProjectField {
  getValue(): string {
    return this.props.project.name;
  }

  setValue(value: string): void {
    Nautilus.Instance.updateProject(this.props.project, { name: value });
  }
};
