import * as React from 'react';
import * as classNames from 'classnames';
import { IProject, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';

interface IProjectDropdownProps {
  project: IProject;
  className?: string;
  onChange(project: IProject): void;
}

interface IProjectDropdownState {
  projects?: IProject[];
}

export default class ProjectDropdown extends React.Component<IProjectDropdownProps, IProjectDropdownState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleDropdownChange = this.handleDropdownChange.bind(this);

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.setState({
      projects: this.application.projects.getAll(),
    });
  }

  private handleDropdownChange(project: IProject) {
    this.props.onChange(project);
  }

  render() {
    return (
      <Dropdown className={classNames('project-dropdown component', this.props.className)} selectedItem={this.props.project} items={this.state.projects} displayProperty="name" onChange={this.handleDropdownChange} />
    );
  }
};
