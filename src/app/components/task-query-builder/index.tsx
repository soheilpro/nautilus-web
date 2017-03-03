import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';

interface ITaskQueryBuilderProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskQueryBuilderState {
}

export default class TaskQueryBuilder extends React.Component<ITaskQueryBuilderProps, ITaskQueryBuilderState> {
  private andQueryBuilderComponent: AndQueryBuilder;

  private queryBuilders: IQueryBuilder[] = [
    { key: 'type', title: 'Type', Component: ItemTypeQueryBuilder, props: { itemKind: 'task' as ItemKind } },
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
