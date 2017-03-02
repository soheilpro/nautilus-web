import React from 'react';
import { IProject } from '../../application';
import { ServiceManager } from '../../services';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IProjectFieldProps {
  project: IProject;
}

interface IProjectFieldState {
}

export default class ProjectField extends React.Component<IProjectFieldProps, IProjectFieldState> {
  private application = ServiceManager.Instance.getApplication();

  render() {
    if (!this.props.project)
      return null;

    const project = this.application.projects.get(this.props.project);

    return (
      <div className="project-field-component">
        {project.name}
      </div>
    );
  }
};
