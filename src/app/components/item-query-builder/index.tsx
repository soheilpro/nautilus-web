import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind, IItem, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IItemQueryBuilderProps {
  queryItem: string;
  itemKind: ItemKind;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IItemQueryBuilderState {
  items?: IItem[];
}

export default class ItemQueryBuilder extends React.PureComponent<IItemQueryBuilderProps, IItemQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      items: [],
    };
  }

  async componentDidMount() {
    this.setState({
      items: _.sortBy(await this.application.items.getAllByKind(this.props.itemKind), item => item.title),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Item');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.items} displayProperty="title" query={this.props.query} queryItem={this.props.queryItem} queryItemType="Item" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
