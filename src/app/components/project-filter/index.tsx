import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';

interface IProjectFilterProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression): void;
}

interface IProjectFilterState {
  projects?: IProject[];
}

export default class ProjectFilter extends React.Component<IProjectFilterProps, IProjectFilterState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.setState({
      projects: this.application.projects.getAll(),
    });
  }

  static canParseQuery(query: NQL.Expression) {
    return ListFilter.canParseQuery(query, 'project', 'Project');
  }

  render() {
    return (
      <ListFilter items={this.state.projects} displayProperty="name" query={this.props.query} queryItem="project" queryItemType="Project" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
