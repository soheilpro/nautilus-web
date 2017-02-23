import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import Filter, { IFilterDefinition } from '../filter';
import ProjectFilter from '../project-filter';
import ItemTypeFilter from '../item-type-filter';
import FilterIssuesByProjectCommand from './filter-issues-by-project-command';
import FilterIssuesByTypeCommand from './filter-issues-by-type-command';

interface IIssueFilterProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueFilterState {
}

export default class IssueFilter extends React.Component<IIssueFilterProps, IIssueFilterState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private filterComponent: Filter;

  private filters: IFilterDefinition[] = [
    { key: 'project', title: 'Project', Component: ProjectFilter},
    { key: 'type',    title: 'Type',    Component: ItemTypeFilter, props: { itemKind: 'issue' as ItemKind } },
  ];

  constructor() {
    super();

    this.handleFilterIssuesCommand = this.handleFilterIssuesCommand.bind(this);
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterIssuesByProjectCommand(_.partial(this.handleFilterIssuesCommand, 'project')),
      new FilterIssuesByTypeCommand(_.partial(this.handleFilterIssuesCommand, 'type')),
    ];
  }

  private handleFilterIssuesCommand(key: string) {
    this.filterComponent.showFilter(key);
  }

  render() {
    return (
      <Filter filters={this.filters} query={this.props.query} onChange={this.props.onChange} ref={e => this.filterComponent = e} />
    );
  }
};
