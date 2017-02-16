import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, asEntity } from '../../application';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';

interface IProjectFilterProps {
  onChange(query: NQL.IExpression): void;
}

interface IProjectFilterState {
  projects?: IProject[];
}

export default class ProjectFilter extends React.Component<IProjectFilterProps, IProjectFilterState> {
  private application = ServiceManager.Instance.getApplication();
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.state = {
      projects: [],
    };
  }

  async componentDidMount() {
    this.setState({
      projects: this.application.projects.getAll(),
    });
  }

  open() {
    this.listFilterComponent.open();
  }

  close() {
    this.listFilterComponent.close();
  }

  render() {
    return (
      <ListFilter className="filter" title="Project" items={this.state.projects} displayProperty="name" queryItem="project" queryItemType="Project" itemToQueryItem={asEntity} onChange={this.props.onChange} ref={e => this.listFilterComponent = e} />
    );
  }
};
