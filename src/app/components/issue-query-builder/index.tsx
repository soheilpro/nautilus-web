import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ProjectQueryBuilder from '../project-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';
import FilterIssuesByProjectCommand from './filter-issues-by-project-command';
import FilterIssuesByTypeCommand from './filter-issues-by-type-command';

interface IIssueQueryBuilderProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueQueryBuilderState {
}

export default class IssueQueryBuilder extends React.Component<IIssueQueryBuilderProps, IIssueQueryBuilderState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private andQueryBuilderComponent: AndQueryBuilder;

  private queryBuilders: IQueryBuilder[] = [
    { key: 'project', title: 'Project', Component: ProjectQueryBuilder},
    { key: 'type',    title: 'Type',    Component: ItemTypeQueryBuilder, props: { itemKind: 'issue' as ItemKind } },
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
    this.andQueryBuilderComponent.showFilter(key);
  }

  render() {
    return (
      <AndQueryBuilder queryBuilders={this.queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
};
