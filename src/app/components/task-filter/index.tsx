import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import Expression from '../expression';
import TaskTypeFilter from '../task-type-filter';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IQueryObject {
  [key: string]: NQL.Expression;
};

interface ITaskFilterProps {
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface ITaskFilterState {
  queries?: IQueryObject;
}

export default class TaskFilter extends React.Component<ITaskFilterProps, ITaskFilterState> {
  private filters = [
    { key: 'type',    Component: TaskTypeFilter },
  ];

  constructor(props: ITaskFilterProps) {
    super();

    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.state = {
      queries: this.getQueryObject(props.query) || {},
    };
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
      <div className="task-filter-component">
        <div className="text">
          <Expression expression={this.getQuery(this.state.queries)} />
        </div>
        <div className="filters">
          {
            this.filters.map(filter => {
              return (
                <filter.Component query={this.state.queries[filter.key]} onChange={_.partial(this.handleFilterChange, filter.key)} ref={null} children={null} key={filter.key} />
              );
            })
          }
        </div>
      </div>
    );
  }
};