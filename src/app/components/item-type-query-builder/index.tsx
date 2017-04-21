import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind, IItemType, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IItemTypeQueryBuilderProps {
  queryItem: string;
  itemKind: ItemKind;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IItemTypeQueryBuilderState {
  itemTypes?: IItemType[];
}

export default class ItemTypeQueryBuilder extends React.PureComponent<IItemTypeQueryBuilderProps, IItemTypeQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      itemTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemTypes: _.sortBy(this.application.itemTypes.getAll(this.props.itemKind), itemType => itemType.order),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'ItemType');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.itemTypes} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
