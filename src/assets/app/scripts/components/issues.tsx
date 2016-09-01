import * as React from 'react';
import { Nautilus, IIssue, entityComparer } from '../nautilus';
import { FilterBox } from './filter-box';
import { IssueList } from './issue-list';
import { IssueDetail } from './issue-detail';
import * as NQL from '../nql/nql'
import { Query } from '../query'
import { KeyMaster, Key, isNotInInput } from '../keymaster'

interface IIssuesState {
  issues?: IIssue[];
  selectedIssueIndex?: number;
}

export class Issues extends React.Component<{}, IIssuesState> {
  private filterBox: FilterBox;
  private newAndUpdatedIssues: IIssue[] = [];

  constructor() {
    super();

    this.state = {
      issues: [],
      selectedIssueIndex: 0
    };
  }

  componentDidMount() {
    this.setState({
      issues: this.getFilteredIssues(),
      selectedIssueIndex: 0
    });

    Nautilus.Instance.on('issueAdded', (issue) => {
      this.newAndUpdatedIssues.push(issue);
      this.setState({
        issues: this.getFilteredIssues(),
        selectedIssueIndex: 0
      })
    });

    Nautilus.Instance.on('issueChanged', (issue) => {
      this.newAndUpdatedIssues.push(issue);
      this.setState({
        issues: this.getFilteredIssues()
      })
    });

    Nautilus.Instance.on('issueDeleted', () => {
      this.setState({
        issues: this.getFilteredIssues()
      })
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      KeyMaster.handle(event, { which: Key.N }, isNotInInput.bind(this), this.addIssue.bind(this));
    });

    ($(".issue-detail-container") as any).sticky();
  }

  addIssue() {
    Nautilus.Instance.addIssue({} as IIssue);
  }

  getFilteredIssues() {
    var issues = Nautilus.Instance.getIssues();

    var filterQuery = this.filterBox ? this.filterBox.getQuery() : null;

    if (filterQuery)
      issues = issues.filter(issue => this.newAndUpdatedIssues.some(entityComparer.bind(this, issue)) || Query.evaluate(filterQuery, issue));

    issues = issues.slice();
    issues.reverse();

    return issues;
  }

  onFiltersChanged(): void {
    this.newAndUpdatedIssues = [];

    this.setState({
      issues: this.getFilteredIssues(),
      selectedIssueIndex: 0
    })

    if (this.filterBox)
      this.saveFilterState(this.filterBox.getFilterState());
  }

  handleSelectionChange(index: number): void {
    this.setState({
      selectedIssueIndex: index
    });
  }

  loadFilterState(): any {
    var item = sessionStorage.getItem('issues/filters');

    if (!item)
      return item;

    return JSON.parse(item);
  }

  saveFilterState(filters: any) {
    sessionStorage.setItem('issues/filters', JSON.stringify(filters));
  }

  render() {
    var selectedIssue = this.state.issues[this.state.selectedIssueIndex];

    return (
      <div>
        <div style={{marginBottom: '20px'}} className='row'>
          <div className='columns'>
            <button title='Shortcut: N' className="button-primary" onClick={this.addIssue.bind(this)}>Add Issue</button>
          </div>
        </div>
        <div className='row'>
          <div className='columns'>
            <FilterBox filterState={this.loadFilterState()} onChanged={this.onFiltersChanged.bind(this)} ref={ref => this.filterBox = ref} />
          </div>
        </div>
        <div className='row'>
          <div className='two columns' style={{minHeight: '1px'}}>
            <div className='issue-detail-container'>
              {
                selectedIssue ? <IssueDetail issue={selectedIssue} /> : null
              }
            </div>
          </div>
          <div className='ten columns'>
            <IssueList issues={this.state.issues} selectedIssueIndex={this.state.selectedIssueIndex} onSelectionChange={this.handleSelectionChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
};
