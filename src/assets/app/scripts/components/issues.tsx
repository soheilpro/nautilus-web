import * as React from 'react';
import { Nautilus, IIssue, entityComparer } from '../nautilus';
import { FilterSet } from '../filter';
import { FilterBox } from './filter-box';
import { FilterableIssueList } from './filterable-issue-list';

interface IssuesState {
  filters?: FilterSet;
}

export class Issues extends React.Component<{}, IssuesState> {
  constructor() {
    super();

    this.state = {
      filters: new FilterSet(['milestones', 'states', 'types', 'areas', 'priorities', 'assignedUsers', 'creators', 'projects'], entityComparer)
    };
  }

  componentDidMount() {
    Mousetrap.bind('ctrl+n', (event: KeyboardEvent) => {
      this.addIssue();
      event.preventDefault();
    });
  }

  onFiltersChanged() {
    this.forceUpdate();
  }

  addIssue() {
    Nautilus.Instance.addIssue({} as IIssue);
  }

  getEnabledFilters() {
    return _.filter(this.state.filters, filter =>
      filter.include.length() > 0 || filter.exclude.length() > 0
    );
  }

  clearFilters() {
    _.each(this.state.filters, filter => {
      filter.clear();
    });

    this.forceUpdate();

    return false;
  }

  render() {
    return (
      <div>
        <div style={{marginBottom: '20px'}} className='row'>
          <div className='columns'>
            <button title='Ctrl+N' className="button-primary" onClick={this.addIssue.bind(this)}>Add Issue</button>
          </div>
        </div>
        <div className='row'>
          <div className='columns filters'>
            <div className='header'>
              <span className='title'>Filters</span>
              <a href='#' style={{display: this.getEnabledFilters().length === 0 ? 'none' : 'inline'}} onClick={this.clearFilters.bind(this)}>Clear</a>
            </div>
            <div className='body'>
              <FilterBox name='Milestone' items={Nautilus.Instance.getMilestones()} displayAttribute='title' filter={this.state.filters['milestones']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='Project' items={Nautilus.Instance.getProjects()} displayAttribute='name' filter={this.state.filters['projects']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='Area' items={Nautilus.Instance.getItemAreas()} displayAttribute='title' filter={this.state.filters['areas']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='Type' items={Nautilus.Instance.getIssueTypes()} displayAttribute='title' filter={this.state.filters['types']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='Priority' items={Nautilus.Instance.getItemPriorities()} displayAttribute='title' filter={this.state.filters['priorities']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='State' items={Nautilus.Instance.getItemStates()} displayAttribute='title' filter={this.state.filters['states']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='Assignee' items={Nautilus.Instance.getUsers()} displayAttribute='name' filter={this.state.filters['assignedUsers']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <FilterBox name='Creator' items={Nautilus.Instance.getUsers()} displayAttribute='name' filter={this.state.filters['creators']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
              <div className='clear'></div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='columns'>
            <FilterableIssueList filters={this.state.filters} />
          </div>
        </div>
      </div>
    );
  }
};
