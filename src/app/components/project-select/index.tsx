import * as React from 'react';
import * as classNames from 'classnames';
import { IProject } from '../../application';
import { ServiceManager } from '../../services';
import Select from '../select';

interface IProjectSelectProps {
  project: IProject;
  className?: string;
  onChange(project: IProject): void;
}

interface IProjectSelectState {
  projects?: IProject[];
}

export default class ProjectSelect extends React.Component<IProjectSelectProps, IProjectSelectState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.handleSelectChange = this.handleSelectChange.bind(this);

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.setState({
      projects: this.application.projects.getAll(),
    });
  }

  private handleSelectChange(project: IProject) {
    this.props.onChange(project);
  }

  render() {
    return (
      <Select className={classNames('project-select-component', this.props.className)} selectedItem={this.props.project} items={this.state.projects} displayProperty="name" onChange={this.handleSelectChange} />
    );
  }
};
