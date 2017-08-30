import * as React from 'react';
import * as NQL from '../../nql';
import { IItemPriority, asEntity, entityComparer } from '../../application';
import ListQueryBuilder from '../list-query-builder';

interface IIssuePriorityQueryBuilderProps {
  itemPriorities: IItemPriority[];
  queryItem: string;
  query?: NQL.IExpression;
  onChange(query: NQL.IExpression, reset: boolean, done: boolean): void;
}

interface IIssuePriorityQueryBuilderState {
}

export default class IssuePriorityQueryBuilder extends React.PureComponent<IIssuePriorityQueryBuilderProps, IIssuePriorityQueryBuilderState> {
  static canParseQuery(query: NQL.IExpression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemPriority');
  }

  render() {
    return (
      <ListQueryBuilder items={this.props.itemPriorities} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemPriority" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
