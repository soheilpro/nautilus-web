import * as React from 'react';
import { Nautilus } from '../nautilus';
import { FilterSet } from '../filter';
import { FilterBox } from './filter-box';
import { FilteredIssueList } from './filtered-issue-list';

interface AppState {
  isInitialized?;
  filters?;
}

export class App extends React.Component<{}, AppState> {
  constructor() {
    super();

    this.state = {
      isInitialized: false,
      filters: new FilterSet(['milestones', 'states', 'assignedUsers', 'projects'])
    };
  }

  componentDidMount() {
    Nautilus.Instance.on('error', (error) => {
      console.log(error); // TODO
    });

    Nautilus.Instance.on('init', () => {
      this.setState({
        isInitialized: true
      });
    });

    Nautilus.Instance.on('issueChanged', () => {
      this.forceUpdate();
    });

    Nautilus.Instance.init();
  }

  onFiltersChanged() {
    this.forceUpdate();
  }

  render() {
    if (!this.state.isInitialized)
      return <span>Loading...</span>;

    return (
      <div>
        <div className='row'>
          <div className='column'>
            <br />
          </div>
        </div>
        <div className='row'>
          <div className='two columns sidebar'>
            <FilterBox name='Milestone' items={Nautilus.Instance.getMilestones()} displayAttribute='title' filter={this.state.filters.milestones} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='State' items={Nautilus.Instance.getStates()} displayAttribute='title' filter={this.state.filters.states} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Assignee' items={Nautilus.Instance.getUsers()} displayAttribute='name' filter={this.state.filters.assignedUsers} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Project' items={Nautilus.Instance.getProjects()} displayAttribute='name' filter={this.state.filters.projects} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
          </div>
          <div className='ten columns'>
            <FilteredIssueList issues={Nautilus.Instance.getIssues()} filters={this.state.filters} />
          </div>
        </div>
      </div>
    );
  }
};
