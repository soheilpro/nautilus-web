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
      filters: new FilterSet(['milestones', 'states', 'types', 'priorities', 'assignedUsers', 'creators', 'projects'], entityComparer)
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", (event) => {
      if (event.which === 78 && event.getModifierState('Control')) { // Ctrl+N
        this.addIssue();
        event.preventDefault();
      }
    }, false);
  }

  onFiltersChanged() {
    this.forceUpdate();
  }

  addIssue() {
    Nautilus.Instance.addIssue({} as IIssue);
  }

  render() {
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
            <FilterBox name='State' items={Nautilus.Instance.getItemStates()} displayAttribute='title' filter={this.state.filters['states']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Type' items={Nautilus.Instance.getIssueTypes()} displayAttribute='title' filter={this.state.filters['types']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Priority' items={Nautilus.Instance.getItemPriorities()} displayAttribute='title' filter={this.state.filters['priorities']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Assignee' items={Nautilus.Instance.getUsers()} displayAttribute='name' filter={this.state.filters['assignedUsers']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Creator' items={Nautilus.Instance.getUsers()} displayAttribute='name' filter={this.state.filters['creators']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Milestone' items={Nautilus.Instance.getMilestones()} displayAttribute='title' filter={this.state.filters['milestones']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
            <FilterBox name='Project' items={Nautilus.Instance.getProjects()} displayAttribute='name' filter={this.state.filters['projects']} filters={this.state.filters} onChanged={this.onFiltersChanged.bind(this)} />
          </div>
          <div className='ten columns'>
            <FilterableIssueList filters={this.state.filters} />
          </div>
        </div>
      </div>
    );
  }
};
