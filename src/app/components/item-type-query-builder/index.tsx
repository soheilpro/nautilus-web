import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind, IItemType, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IIssueTypeQueryBuilderProps {
  itemKind: ItemKind;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IIssueTypeQueryBuilderState {
  itemTypes?: IItemType[];
}

export default class IssueTypeQueryBuilder extends React.Component<IIssueTypeQueryBuilderProps, IIssueTypeQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      itemTypes: [],
    };
  }

  componentDidMount() {
    this.setState({
      itemTypes: this.application.itemTypes.getAll(this.props.itemKind),
    });
  }

  static canParseQuery(query: NQL.Expression) {
    return ListQueryBuilder.canParseQuery(query, 'type', 'ItemType');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.itemTypes} displayProperty="title" query={this.props.query} queryItem="type" queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
