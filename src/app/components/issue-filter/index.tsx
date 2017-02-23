import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ItemKind } from '../../application';
import { ICommandProvider, ICommand } from '../../commands';
import { ServiceManager } from '../../services';
import Expression from '../expression';
import ProjectFilter from '../project-filter';
import ItemTypeFilter from '../item-type-filter';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IQueryObject {
  [key: string]: NQL.Expression;
};

interface IIssueFilterProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IIssueFilterState {
  queries?: IQueryObject;
}

export default class IssueFilter extends React.Component<IIssueFilterProps, IIssueFilterState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();

  private filters = [
    { key: 'project', Component: ProjectFilter,  props: {} },
    { key: 'type',    Component: ItemTypeFilter, props: { itemKind: 'issue' as ItemKind } },
  ];

  constructor(props: IIssueFilterProps) {
    super();

    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.state = {
      queries: this.getQueryObject(props.query) || {},
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [] as ICommand[];
  }

  private getQueryObject(query: NQL.Expression) {
    if (!query)
      return null;

    let children = (query as NQL.AndExpression).children.slice();
    let queries: IQueryObject = {};

    for (let child of children) {
      for (let filter of this.filters) {
        if (filter.Component.canParseQuery(child)) {
          queries[filter.key] = child;
          break;
        }
      }
    }

    return queries;
  }

  private handleFilterChange(key: string, query: NQL.IExpression) {
    let queries = _.clone(this.state.queries);

    if (query)
      queries[key] = query;
    else
      delete queries[key];

    this.setState({
      queries: queries,
    });

    this.props.onChange(this.getQuery(queries));
  }

  private getQuery(queries: IQueryObject) {
    let queryValues = _.values(queries);

    if (queryValues.length === 0)
      return null;

    return new NQL.AndExpression(queryValues);
  }

  render() {
    return (
      <div className="issue-filter-component">
        <div className="text">
          <Expression expression={this.getQuery(this.state.queries)} />
        </div>
        <div className="filters">
          {
            this.filters.map(filter => {
              return (
                <filter.Component query={this.state.queries[filter.key]} onChange={_.partial(this.handleFilterChange, filter.key)} {...filter.props} ref={null} children={null} key={filter.key} />
              );
            })
          }
        </div>
      </div>
    );
  }
};
