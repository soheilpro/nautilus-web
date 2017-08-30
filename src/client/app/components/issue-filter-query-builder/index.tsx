import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { IProject, IItemType, IItemPriority, IItemState, IUser, IMilestone } from '../../application';
import { ServiceManager } from '../../services';
import AndQueryBuilder, { IQueryBuilder } from '../and-query-builder';
import MilestoneQueryBuilder from '../milestone-query-builder';
import ProjectQueryBuilder from '../project-query-builder';
import ItemTypeQueryBuilder from '../item-type-query-builder';
import ItemPriorityQueryBuilder from '../item-priority-query-builder';
import ItemStateQueryBuilder from '../item-state-query-builder';
import UserQueryBuilder from '../user-query-builder';

interface IIssueFilterQueryBuilderProps {
  query: NQL.IExpression;
  onChange(query: NQL.IExpression): void;
}

interface IIssueFilterQueryBuilderState {
  projects?: IProject[];
  itemTypes?: IItemType[];
  itemPriorities?: IItemPriority[];
  itemStates?: IItemState[];
  users?: IUser[];
  milestones?: IMilestone[];
}

export default class IssueFilterQueryBuilder extends React.PureComponent<IIssueFilterQueryBuilderProps, IIssueFilterQueryBuilderState> {
  private application = ServiceManager.Instance.getApplication();
  private andQueryBuilderComponent: AndQueryBuilder;

  constructor() {
    super();

    this.state = {
      projects: [],
      itemTypes: [],
      itemPriorities: [],
      itemStates: [],
      users: [],
      milestones: [],
    };
  }

  componentDidMount() {
    const closedMilestoneState = _.find(this.application.itemStates.getAll('milestone'), itemState => itemState.key === 'closed');

    this.setState({
      projects: this.application.projects.getAll(),
      itemTypes: this.application.itemTypes.getAll('issue'),
      itemPriorities: this.application.itemPriorities.getAll('issue'),
      itemStates: this.application.itemStates.getAll('issue'),
      users: this.application.users.getAll(),
      milestones: this.application.items.getAllMilestones(new NQL.ComparisonExpression(new NQL.LocalExpression('state'), new NQL.ConstantExpression(closedMilestoneState, 'ItemState'), 'neq'), [new NQL.SortExpression(new NQL.LocalExpression('fullTitle'))]),
    });
  }

  open(key: string) {
    this.andQueryBuilderComponent.open(key);
  }

  render() {
    const queryBuilders: IQueryBuilder[] = [
      { key: 'milestone',  title: 'Milestone',   queryItem: 'milestone',  Component: MilestoneQueryBuilder,    props: { milestones: this.state.milestones } },
      { key: 'project',    title: 'Project',     queryItem: 'project',    Component: ProjectQueryBuilder,      props: { projects: this.state.projects } },
      { key: 'type',       title: 'Type',        queryItem: 'type',       Component: ItemTypeQueryBuilder,     props: { itemTypes: this.state.itemTypes } },
      { key: 'priority',   title: 'Priority',    queryItem: 'priority',   Component: ItemPriorityQueryBuilder, props: { itemPriorities: this.state.itemPriorities } },
      { key: 'state',      title: 'State',       queryItem: 'state',      Component: ItemStateQueryBuilder,    props: { itemStates: this.state.itemStates } },
      { key: 'assignedTo', title: 'Assigned To', queryItem: 'assignedTo', Component: UserQueryBuilder,         props: { users: this.state.users } },
      { key: 'createdBy',  title: 'Created By',  queryItem: 'createdBy',  Component: UserQueryBuilder,         props: { users: this.state.users } },
    ];

    return (
      <AndQueryBuilder queryBuilders={queryBuilders} query={this.props.query} onChange={this.props.onChange} ref={e => this.andQueryBuilderComponent = e} />
    );
  }
};
