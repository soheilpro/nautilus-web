import * as React from 'react';
import { Nautilus, IIssue } from '../nautilus';
import { FilterBox } from './filter-box';
import { IssueList } from './issue-list';
import * as NQL from '../nql/nql'
import { Query } from '../query'

export class Issues extends React.Component<{}, {}> {
  private filterBox: FilterBox;

  componentDidMount() {
    Nautilus.Instance.on('issueAdded', () => {
      this.forceUpdate();
    });

    Nautilus.Instance.on('issueChanged', () => {
      this.forceUpdate();
    });

    Nautilus.Instance.on('issueDeleted', () => {
      this.forceUpdate();
    });

    Mousetrap.bind('ctrl+n', (event: KeyboardEvent) => {
      this.addIssue();
      event.preventDefault();
    });
  }

  addIssue() {
    Nautilus.Instance.addIssue({} as IIssue);
  }

  getIssues() {
    var issues = Nautilus.Instance.getIssues();
    var query = this.filterBox ? this.filterBox.getQuery() : null;

    if (!query)
      return issues;

    return issues.filter(issue => Query.evaluate(query, issue));
  }

  onFiltersChanged(): void {
    this.forceUpdate();
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
          <FilterBox onChanged={this.onFiltersChanged.bind(this)} ref={ref => this.filterBox = ref} />
        </div>
        <div className='row'>
          <div className='columns'>
            <IssueList issues={this.getIssues()} />
          </div>
        </div>
      </div>
    );
  }
};
