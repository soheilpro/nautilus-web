import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider, ICommand } from '../../commands';
import { ServiceManager } from '../../services';
import Dropdown from '../dropdown';
import Expression from '../expression';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IFilterComponentProps {
  query?: NQL.Expression;
  onChange(query: NQL.IExpression, done: boolean): void;
}

declare class FilterComponent extends React.Component<IFilterComponentProps, {}> {
  static canParseQuery(query: NQL.Expression): void;
}

export interface IFilterDefinition {
  key: string;
  title: string;
  Component: typeof FilterComponent;
  props?: Object;
}

interface IQueryObject {
  [key: string]: NQL.Expression;
};

interface IFilterProps {
  filters: IFilterDefinition[];
  query: NQL.Expression;
  onChange(query: NQL.Expression): void;
}

interface IFilterState {
  queries?: IQueryObject;
}

export default class Filter extends React.Component<IFilterProps, IFilterState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private dropdownComponents: { [key: string]: Dropdown } = {};

  constructor(props: IFilterProps) {
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
      for (let filter of this.props.filters) {
        if (filter.Component.canParseQuery(child)) {
          queries[filter.key] = child;
          break;
        }
      }
    }

    return queries;
  }

  private handleFilterChange(key: string, query: NQL.IExpression, done: boolean) {
    let queries = _.clone(this.state.queries);

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
    let queryValues = _.values(queries);

    if (queryValues.length === 0)
      return null;

    return new NQL.AndExpression(queryValues);
  }

  render() {
    return (
      <div className="filter-component">
        <div className="text">
          <Expression expression={this.getQuery(this.state.queries)} />
        </div>
        <div className="filters">
          {
            this.props.filters.map(filter => {
              return (
                <Dropdown className="filter" title={filter.title} ref={e => this.dropdownComponents[filter.key] = e} key={filter.key}>
                  <div className="container">
                    <filter.Component query={this.state.queries[filter.key]} onChange={_.partial(this.handleFilterChange, filter.key)} {...filter.props} />
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
