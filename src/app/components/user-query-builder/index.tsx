import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IUser, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IUserQueryBuilderProps {
  queryItem: string;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IUserQueryBuilderState {
  users?: IUser[];
}

export default class UserQueryBuilder extends React.Component<IUserQueryBuilderProps, IUserQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.setState({
      users: _.sortBy(this.application.users.getAll(), user => user.name),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'User');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.users} displayProperty="name" query={this.props.query} queryItem={this.props.queryItem} queryItemType="User" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
