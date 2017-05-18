import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IMilestone, asEntity, entityComparer } from '../../application';
import { ServiceManager } from '../../services';
import ListQueryBuilder from '../list-query-builder';

interface IMilestoneQueryBuilderProps {
  queryItem: string;
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IMilestoneQueryBuilderState {
  milestones?: IMilestone[];
}

export default class MilestoneQueryBuilder extends React.PureComponent<IMilestoneQueryBuilderProps, IMilestoneQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();

  constructor() {
    super();

    this.state = {
      milestones: [],
    };
  }

  async componentDidMount() {
    this.setState({
      milestones: _.sortBy(await this.application.items.getAllMilestones(null), milestone => milestone.title),
    });
  }

  static canParseQuery(query: NQL.Expression, queryItem: string) {
    return ListQueryBuilder.canParseQuery(query, queryItem, 'Milestone');
  }

  render() {
    return (
      <ListQueryBuilder items={this.state.milestones} displayProperty="fullTitle" query={this.props.query} queryItem={this.props.queryItem} queryItemType="Milestone" itemToQueryItem={asEntity} itemComparer={entityComparer} onChange={this.props.onChange} />
    );
  }
};
