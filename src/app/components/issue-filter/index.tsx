import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import Filter, { IFilterDefinition } from '../filter';
import ProjectFilter from '../project-filter';
import ItemTypeFilter from '../item-type-filter';

interface IIssueFilterProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueFilterState {
}

export default class IssueFilter extends React.Component<IIssueFilterProps, IIssueFilterState> {
  private filters: IFilterDefinition[] = [
    { key: 'project', title: 'Project', Component: ProjectFilter},
    { key: 'type',    title: 'Type',    Component: ItemTypeFilter, props: { itemKind: 'issue' as ItemKind } },
  ];

  render() {
    return (
      <Filter filters={this.filters} query={this.props.query} onChange={this.props.onChange} />
    );
  }
};
