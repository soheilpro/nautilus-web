import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import Filter, { IFilterDefinition } from '../filter';
import ItemTypeFilter from '../item-type-filter';

interface ITaskFilterProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskFilterState {
}

export default class TaskFilter extends React.Component<ITaskFilterProps, ITaskFilterState> {
  private filters: IFilterDefinition[] = [
    { key: 'type', title: 'Type', Component: ItemTypeFilter, props: { itemKind: 'task' as ItemKind } },
  ];

  render() {
    return (
      <Filter filters={this.filters} query={this.props.query} onChange={this.props.onChange} />
    );
  }
};
