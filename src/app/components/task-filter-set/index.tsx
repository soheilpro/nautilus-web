import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import FilterSet, { IFilterDefinition } from '../filter-set';
import ItemTypeFilter from '../item-type-filter';
import FilterTasksByTypeCommand from './filter-tasks-by-type-command';

interface ITaskFilterSetProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskFilterSetState {
}

export default class TaskFilterSet extends React.Component<ITaskFilterSetProps, ITaskFilterSetState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private filterSetComponent: FilterSet;

  private filters: IFilterDefinition[] = [
    { key: 'type', title: 'Type', Component: ItemTypeFilter, props: { itemKind: 'task' as ItemKind } },
  ];

  constructor() {
    super();

    this.handleFilterTasksCommandExecute = this.handleFilterTasksCommandExecute.bind(this);
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterTasksByTypeCommand(_.partial(this.handleFilterTasksCommandExecute, 'type')),
    ];
  }

  private handleFilterTasksCommandExecute(key: string) {
    this.filterSetComponent.showFilter(key);
  }

  render() {
    return (
      <FilterSet filters={this.filters} query={this.props.query} onChange={this.props.onChange} ref={e => this.filterSetComponent = e} />
    );
  }
};
