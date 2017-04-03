import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';
import ItemStateQueryBuilder from '../item-state-query-builder';
import UserQueryBuilder from '../user-query-builder';

interface ITaskQueryBuilderProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskQueryBuilderState {
}

export default class TaskQueryBuilder extends React.Component<ITaskQueryBuilderProps, ITaskQueryBuilderState> {
  private andQueryBuilderComponent: AndQueryBuilder;

  private queryBuilders: IQueryBuilder[] = [
    { key: 'type',       title: 'Type',        queryItem: 'type',       Component: ItemTypeQueryBuilder,  props: { itemKind: 'task' as ItemKind } },
    { key: 'state',      title: 'State',       queryItem: 'state',      Component: ItemStateQueryBuilder, props: { itemKind: 'task' as ItemKind } },
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
