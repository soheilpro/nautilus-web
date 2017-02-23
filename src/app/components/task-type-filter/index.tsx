import * as React from 'react';
import * as NQL from '../../nql';
import { ITaskType, asEntity, entityComparer } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import ListFilter from '../list-filter';
import FilterTasksByTypeCommand from './filter-tasks-by-type-command';

interface ITaskTypeFilterProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression): void;
}

interface ITaskTypeFilterState {
  taskTypes?: ITaskType[];
}

export default class TaskTypeFilter extends React.Component<ITaskTypeFilterProps, ITaskTypeFilterState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private listFilterComponent: ListFilter;

  constructor() {
    super();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    this.state = {
      taskTypes: [],
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  async componentDidMount() {
    this.setState({
      taskTypes: this.application.taskTypes.getAll(),
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterTasksByTypeCommand(this.open),
    ];
  }

  open() {
    this.listFilterComponent.open();
  }

  close() {
    this.listFilterComponent.close();
  }

  static canParseQuery(query: NQL.Expression) {
    return ListFilter.canParseQuery(query, 'type', 'TaskType');
  }

  render() {
    return (
      <ListFilter className="filter" title="Type" items={this.state.taskTypes} displayProperty="title" query={this.props.query} queryItem="type" queryItemType="TaskType" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} ref={e => this.listFilterComponent = e} />
    );
  }
};
