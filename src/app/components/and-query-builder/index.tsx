import _ from 'underscore';
import React from 'react';
import classNames from 'classnames';
import NQL from '../../nql';
import Dropdown from '../dropdown';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IQueryBuilderProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

declare class QueryBuilder extends React.Component<IQueryBuilderProps, {}> {
  static canParseQuery(query: NQL.Expression): void;
}

export interface IQueryBuilder {
  key: string;
  title: string;
  Component: typeof QueryBuilder;
  props?: Object;
}

interface IQueryObject {
  [key: string]: NQL.Expression;
};

interface IAndQueryBuilderProps {
  queryBuilders: IQueryBuilder[];
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IAndQueryBuilderState {
  queries?: IQueryObject;
}

export default class AndQueryBuilder extends React.Component<IAndQueryBuilderProps, IAndQueryBuilderState> {
  private dropdownComponents: { [key: string]: Dropdown } = {};

  constructor(props: IAndQueryBuilderProps) {
    super();

    this.handleFilterChange = this.handleFilterChange.bind(this);

    this.state = {
      queries: this.getQueryObject(props.query) || {},
    };
  }

  componentWillReceiveProps(nextProps: IAndQueryBuilderProps) {
    this.state = {
      queries: this.getQueryObject(nextProps.query) || {},
    };
  }

  showFilter(key: string) {
    this.dropdownComponents[key].open();
  }

  private getQueryObject(query: NQL.Expression) {
    if (!query)
      return null;

    const children = (query as NQL.AndExpression).children.slice();
    const queries: IQueryObject = {};

    for (const child of children) {
      for (const queryBuilder of this.props.queryBuilders) {
        if (queryBuilder.Component.canParseQuery(child)) {
          queries[queryBuilder.key] = child;
          break;
        }
      }
    }

    return queries;
  }

  private handleFilterChange(key: string, query: NQL.IExpression, done: boolean) {
    const queries = _.clone(this.state.queries);

    if (query)
      queries[key] = query;
    else
      delete queries[key];

    this.setState({
      queries: queries,
    });

    if (done)
      this.dropdownComponents[key].close();

    this.props.onChange(this.getQuery(queries));
  }

  private getQuery(queries: IQueryObject) {
    const queryValues = _.values(queries);

    if (queryValues.length === 0)
      return null;

    return new NQL.AndExpression(queryValues);
  }

  render() {
    return (
      <div className="and-query-builder-component">
        <div className="query-builders">
          {
            this.props.queryBuilders.map(queryBuilder => {
              return (
                <Dropdown className={classNames('query-builder', { 'active': !!this.state.queries[queryBuilder.key] })} title={queryBuilder.title} ref={e => this.dropdownComponents[queryBuilder.key] = e} key={queryBuilder.key}>
                  <div className="container">
                    <queryBuilder.Component query={this.state.queries[queryBuilder.key]} onChange={_.partial(this.handleFilterChange, queryBuilder.key)} {...queryBuilder.props} />
                  </div>
                </Dropdown>
              );
            })
          }
        </div>
      </div>
    );
  }
};
