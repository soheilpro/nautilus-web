import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind, IItemState, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IItemStateQueryBuilderProps {
  queryItem: string;
  itemKind: ItemKind;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IItemStateQueryBuilderState {
  itemStates?: IItemState[];
}

export default class ItemStateQueryBuilder extends React.Component<IItemStateQueryBuilderProps, IItemStateQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      itemStates: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemStates: _.sortBy(this.application.itemStates.getAll(this.props.itemKind), itemState => itemState.order),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemState');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.itemStates} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemState" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
