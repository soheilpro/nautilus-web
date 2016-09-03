import * as React from 'react';
import { Nautilus, IProject, entityComparer } from '../nautilus';
import { ProjectGrid } from './project-grid';

interface IProjectListProps {
  projects?: IProject[];
  selectedProjectIndex?: number;
}

export class ProjectList extends React.Component<IProjectListProps, {}> {
  handleSelectionChange(index: number): void {
    this.setState({
      selectedProjectIndex: index
    });
  }

  render() {
    var selectedProject = this.props.projects[this.props.selectedProjectIndex];

    return (
      <ProjectGrid projects={this.props.projects} selectedProjectIndex={this.props.selectedProjectIndex} onSelectionChange={this.handleSelectionChange.bind(this)} />
    );
  }
};
