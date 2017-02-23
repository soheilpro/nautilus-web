import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import FilterSet, { IFilterDefinition } from '../filter-set';
import ProjectFilter from '../project-filter';
import ItemTypeFilter from '../item-type-filter';
import FilterIssuesByProjectCommand from './filter-issues-by-project-command';
import FilterIssuesByTypeCommand from './filter-issues-by-type-command';

interface IIssueFilterSetProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueFilterSetState {
}

export default class IssueFilterSet extends React.Component<IIssueFilterSetProps, IIssueFilterSetState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private filterSetComponent: FilterSet;

  private filters: IFilterDefinition[] = [
    { key: 'project', title: 'Project', Component: ProjectFilter},
    { key: 'type',    title: 'Type',    Component: ItemTypeFilter, props: { itemKind: 'issue' as ItemKind } },
  ];

  constructor() {
    super();

    this.handleFilterIssuesCommandExecute = this.handleFilterIssuesCommandExecute.bind(this);
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterIssuesByProjectCommand(_.partial(this.handleFilterIssuesCommandExecute, 'project')),
      new FilterIssuesByTypeCommand(_.partial(this.handleFilterIssuesCommandExecute, 'type')),
    ];
  }

  private handleFilterIssuesCommandExecute(key: string) {
    this.filterSetComponent.showFilter(key);
  }

  render() {
    return (
      <FilterSet filters={this.filters} query={this.props.query} onChange={this.props.onChange} ref={e => this.filterSetComponent = e} />
    );
  }
};
