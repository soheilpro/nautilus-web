import _ from 'underscore';
import React from 'react';
import NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';
import FilterTasksByTypeCommand from './filter-tasks-by-type-command';

interface ITaskQueryBuilderProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskQueryBuilderState {
}

export default class TaskQueryBuilder extends React.Component<ITaskQueryBuilderProps, ITaskQueryBuilderState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private andQueryBuilderComponent: AndQueryBuilder;

  private queryBuilders: IQueryBuilder[] = [
    { key: 'type', title: 'Type', Component: ItemTypeQueryBuilder, props: { itemKind: 'task' as ItemKind } },
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
    this.andQueryBuilderComponent.showFilter(key);
  }

  render() {
    return (
      <AndQueryBuilder queryBuilders={this.queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
};
