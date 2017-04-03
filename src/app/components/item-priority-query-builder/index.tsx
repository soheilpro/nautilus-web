import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind, IItemPriority, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IIssuePriorityQueryBuilderProps {
  queryItem: string;
  itemKind: ItemKind;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IIssuePriorityQueryBuilderState {
  itemPriorities?: IItemPriority[];
}

export default class IssuePriorityQueryBuilder extends React.Component<IIssuePriorityQueryBuilderProps, IIssuePriorityQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      itemPriorities: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemPriorities: _.sortBy(this.application.itemPriorities.getAll(this.props.itemKind), itemPriority => itemPriority.order),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemPriority');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.itemPriorities} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemPriority" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
