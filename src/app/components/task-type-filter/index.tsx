import * as React from 'react';
import * as NQL from '../../nql';
import { IItemType, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';

interface ITaskTypeFilterProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression): void;
}

interface ITaskTypeFilterState {
  taskTypes?: IItemType[];
}

export default class TaskTypeFilter extends React.Component<ITaskTypeFilterProps, ITaskTypeFilterState> {
  private application = ServiceManager.Instance.getApplication();
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      taskTypes: [],
    };
  }

  async componentDidMount() {
    this.setState({
      taskTypes: this.application.itemTypes.getAll('task'),
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
      <ListFilter className="filter" title="Type" items={this.state.taskTypes} displayProperty="title" query={this.props.query} queryItem="type" queryItemType="ItemType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} ref={e => this.listFilterComponent = e} />
    );
  }
};
