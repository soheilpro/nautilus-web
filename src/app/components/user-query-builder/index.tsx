import * as React from 'react';
import * as NQL from '../../nql';
import { IUser, asEntity, entityComparer } from '../../application';
import ListQueryBuilder from '../list-query-builder';

interface IUserQueryBuilderProps {
  users: IUser[];
  queryItem: string;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IUserQueryBuilderState {
}

export default class UserQueryBuilder extends React.PureComponent<IUserQueryBuilderProps, IUserQueryBuilderState> {
  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'User');
  }

  render() {
    return (
      <ListQueryBuilder items={this.props.users} displayProperty="name" query={this.props.query} queryItem={this.props.queryItem} queryItemType="User" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
