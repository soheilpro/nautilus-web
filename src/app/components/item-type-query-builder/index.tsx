import * as React from 'react';
import * as NQL from '../../nql';
import { IItemType, asEntity, entityComparer } from '../../application';
import ListQueryBuilder from '../list-query-builder';

interface IItemTypeQueryBuilderProps {
  itemTypes: IItemType[];
  queryItem: string;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IItemTypeQueryBuilderState {
}

export default class ItemTypeQueryBuilder extends React.PureComponent<IItemTypeQueryBuilderProps, IItemTypeQueryBuilderState> {
  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemType');
  }

  render() {
    return (
      <ListQueryBuilder items={this.props.itemTypes} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
