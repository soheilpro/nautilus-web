import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import Expression from '../expression';
import ProjectFilter from '../project-filter';
import IssueTypeFilter from '../issue-type-filter';
import FilterIssuesByProjectCommand from './filter-issues-by-project-command';
import FilterIssuesByTypeCommand from './filter-issues-by-type-command';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IFilterQueryObject {
  [key: string]: NQL.Expression;
};

interface IIssueFilterProps {
}

interface IIssueFilterState {
  filterQueries?: IFilterQueryObject;
  isProjectFilterOpen?: boolean;
  isTypeFilterOpen?: boolean;
}

export default class IssueFilter extends React.Component<IIssueFilterProps, IIssueFilterState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private projectFilterComponent: ProjectFilter;
  private issueTypeComponent: IssueTypeFilter;

  constructor() {
    super();

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterIssuesByProjectCommandExecute = this.handleFilterIssuesByProjectCommandExecute.bind(this);
    this.handleFilterIssuesByTypeCommandExecute = this.handleFilterIssuesByTypeCommandExecute.bind(this);

    this.state = {
      filterQueries: { // Required for proper sorting
        project: null,
        issueType: null,
      },
    };
  }

  async componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new FilterIssuesByProjectCommand(this.handleFilterIssuesByProjectCommandExecute),
      new FilterIssuesByTypeCommand(this.handleFilterIssuesByTypeCommandExecute),
    ];
  }

  private handleFilterChange(key: string, query: NQL.IExpression) {
    this.setState({
      filterQueries: _.assign(this.state.filterQueries, { [key]: query }),
    });
  }

  private handleFilterIssuesByProjectCommandExecute() {
    this.projectFilterComponent.open();
  }

  private handleFilterIssuesByTypeCommandExecute() {
    this.issueTypeComponent.open();
  }

  private getFilterQuery(filterQueries: IFilterQueryObject) {
    let filterQueryValues = _.values(filterQueries).filter(query => query !== null);

    if (filterQueryValues.length === 0)
      return null;

    return new NQL.AndExpression(filterQueryValues);
  }

  render() {
    return (
      <div className="issue-filter-component">
        <div className="text">
          <Expression expression={this.getFilterQuery(this.state.filterQueries)} />
        </div>
        <div className="filters">
          <div className="filter">
            <ProjectFilter onChange={_.partial(this.handleFilterChange, 'project')} ref={e => this.projectFilterComponent = e} />
          </div>
          <div className="filter">
            <IssueTypeFilter onChange={_.partial(this.handleFilterChange, 'type')} ref={e => this.issueTypeComponent = e} />
          </div>
        </div>
      </div>
    );
  }
};
