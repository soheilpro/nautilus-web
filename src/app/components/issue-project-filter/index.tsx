import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, asEntity, entityComparer } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';
import FilterIssuesByProjectCommand from './filter-issues-by-project-command';

interface IProjectFilterProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression): void;
}

interface IProjectFilterState {
  projects?: IProject[];
}

export default class ProjectFilter extends React.Component<IProjectFilterProps, IProjectFilterState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      projects: [],
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  async componentDidMount() {
    this.setState({
      projects: this.application.projects.getAll(),
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterIssuesByProjectCommand(this.open),
    ];
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
