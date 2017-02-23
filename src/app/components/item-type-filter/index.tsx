import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind, IItemType, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';

interface IIssueTypeFilterProps {
  itemKind: ItemKind;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression): void;
}

interface IIssueTypeFilterState {
  itemTypes?: IItemType[];
}

export default class IssueTypeFilter extends React.Component<IIssueTypeFilterProps, IIssueTypeFilterState> {
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
    return ListFilter.canParseQuery(query, 'type', 'ItemType');
  }

  render() {
    return (
      <ListFilter items={this.state.itemTypes} displayProperty="title" query={this.props.query} queryItem="type" queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
