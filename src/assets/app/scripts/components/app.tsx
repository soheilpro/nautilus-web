import * as React from 'react';
import { Nautilus } from '../nautilus';
import { FilterSet } from '../filter';
import { FilterBox } from './filter-box';
import { FilterableIssueList } from './filterable-issue-list';

interface AppState {
  isInitialized?;
  error?;
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
    document.addEventListener("keydown", (event) => {
      if (event.which === 78 && event.getModifierState('Control')) { // Ctrl+N
        this.addIssue();
        event.preventDefault();
      }
    }, false);

    Nautilus.Instance.on('error', (error) => {
      this.setState({
        error: error
      });
    });

    Nautilus.Instance.on('init', () => {
      this.setState({
        isInitialized: true
      });
    });

    Nautilus.Instance.init();
  }

  onFiltersChanged() {
    this.forceUpdate();
  }

  addIssue() {
    Nautilus.Instance.addIssue({});
  }

  render() {
    if (!this.state.isInitialized)
      return <span>Loading...</span>;

    if (this.state.error)
      return (
        <div>
          <div>Error!</div>
          <div>{this.state.error.toString()}</div>
          <div>{this.state.error.stack}</div>
        </div>
      );

    return (
      <div>
        <div style={{marginBottom: '20px'}} className='row'>
          <div className='two columns'>
            &nbsp;
          </div>
          <div className='ten columns'>
            <button title='Ctrl+N' className="button-primary" onClick={this.addIssue.bind(this)}>Add Issue</button>
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
            <FilterableIssueList filters={this.state.filters} />
          </div>
        </div>
      </div>
    );
  }
};
