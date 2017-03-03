import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import ProjectQueryBuilder from '../project-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';

interface IIssueQueryBuilderProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueQueryBuilderState {
}

export default class IssueQueryBuilder extends React.Component<IIssueQueryBuilderProps, IIssueQueryBuilderState> {
  private andQueryBuilderComponent: AndQueryBuilder;

  private queryBuilders: IQueryBuilder[] = [
    { key: 'project', title: 'Project', Component: ProjectQueryBuilder},
    { key: 'type',    title: 'Type',    Component: ItemTypeQueryBuilder, props: { itemKind: 'issue' as ItemKind } },
  ];

  open(key: string) {
    this.andQueryBuilderComponent.open(key);
  }

  render() {
    return (
      <AndQueryBuilder queryBuilders={this.queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
};
