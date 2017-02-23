import * as React from 'react';
import * as NQL from '../../nql';
import { IItemType, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';

interface IIssueTypeFilterProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression): void;
}

interface IIssueTypeFilterState {
  issueTypes?: IItemType[];
}

export default class IssueTypeFilter extends React.Component<IIssueTypeFilterProps, IIssueTypeFilterState> {
  private application = ServiceManager.Instance.getApplication();
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      issueTypes: [],
    };
  }

  async componentDidMount() {
    this.setState({
      issueTypes: this.application.itemTypes.getAll('issue'),
    });
  }

  open() {
    this.listFilterComponent.open();
  }

  close() {
    this.listFilterComponent.close();
  }

  static canParseQuery(query: NQL.Expression) {
    return ListFilter.canParseQuery(query, 'type', 'ItemType');
  }

  render() {
    return (
      <ListFilter className="filter" title="Type" items={this.state.issueTypes} displayProperty="title" query={this.props.query} queryItem="type" queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} ref={e => this.listFilterComponent = e} />
    );
  }
};
