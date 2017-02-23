import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import Filter, { IFilterDefinition } from '../filter';
import ItemTypeFilter from '../item-type-filter';
import FilterTasksByTypeCommand from './filter-tasks-by-type-command';

interface ITaskFilterProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskFilterState {
}

export default class TaskFilter extends React.Component<ITaskFilterProps, ITaskFilterState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private filterComponent: Filter;

  private filters: IFilterDefinition[] = [
    { key: 'type', title: 'Type', Component: ItemTypeFilter, props: { itemKind: 'task' as ItemKind } },
  ];

  constructor() {
    super();

    this.handleFilterTasksCommand = this.handleFilterTasksCommand.bind(this);
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterTasksByTypeCommand(_.partial(this.handleFilterTasksCommand, 'type')),
    ];
  }

  private handleFilterTasksCommand(key: string) {
    this.filterComponent.showFilter(key);
  }

  render() {
    return (
      <Filter filters={this.filters} query={this.props.query} onChange={this.props.onChange} ref={e => this.filterComponent = e} />
    );
  }
};
