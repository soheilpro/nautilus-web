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
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

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

  static canParseQuery(query: NQL.Expression) {
    return ListFilter.canParseQuery(query, 'project', 'Project');
  }

  render() {
    return (
      <ListFilter className="filter" title="Project" items={this.state.projects} displayProperty="name" query={this.props.query} queryItem="project" queryItemType="Project" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} ref={e => this.listFilterComponent = e} />
    );
  }
};
