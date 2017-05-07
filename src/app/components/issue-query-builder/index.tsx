import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ItemQueryBuilder from '../item-query-builder';
import ProjectQueryBuilder from '../project-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';
import ItemPriorityQueryBuilder from '../item-priority-query-builder';
import ItemStateQueryBuilder from '../item-state-query-builder';
import UserQueryBuilder from '../user-query-builder';

interface IIssueQueryBuilderProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueQueryBuilderState {
}

export default class IssueQueryBuilder extends React.PureComponent<IIssueQueryBuilderProps, IIssueQueryBuilderState> {
  private andQueryBuilderComponent: AndQueryBuilder;

  private queryBuilders: IQueryBuilder[] = [
    { key: 'milestone',  title: 'Milestone',   queryItem: 'milestone',  Component: ItemQueryBuilder,         props: { itemKind: 'milestone' as ItemKind } },
    { key: 'project',    title: 'Project',     queryItem: 'project',    Component: ProjectQueryBuilder},
    { key: 'type',       title: 'Type',        queryItem: 'type',       Component: ItemTypeQueryBuilder,     props: { itemKind: 'issue' as ItemKind } },
    { key: 'priority',   title: 'Priority',    queryItem: 'priority',   Component: ItemPriorityQueryBuilder, props: { itemKind: 'issue' as ItemKind } },
    { key: 'state',      title: 'State',       queryItem: 'state',      Component: ItemStateQueryBuilder,    props: { itemKind: 'issue' as ItemKind } },
    { key: 'assignedTo', title: 'Assigned To', queryItem: 'assignedTo', Component: UserQueryBuilder },
    { key: 'createdBy',  title: 'Created By',  queryItem: 'createdBy',  Component: UserQueryBuilder },
  ];

  open(key: string) {
    this.andQueryBuilderComponent.open(key);
  }

  render() {
    return (
      <AndQueryBuilder queryBuilders={this.queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
};
