import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IProjectQueryBuilderProps {
  queryItem: string;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IProjectQueryBuilderState {
  projects?: IProject[];
}

export default class ProjectQueryBuilder extends React.Component<IProjectQueryBuilderProps, IProjectQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    this.setState({
      projects: _.sortBy(this.application.projects.getAll(), project => project.name),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Project');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.projects} displayProperty="name" query={this.props.query} queryItem={this.props.queryItem} queryItemType="Project" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
