import * as React from 'react';
import { Nautilus, IItem, IIssue, ITask, entityComparer } from '../nautilus';
import { Nav } from './nav';
import { FilterBox } from './filter-box';
import { IssueList } from './issue-list';
import { IssueDetail } from './issue-detail';
import { TaskDetail } from './task-detail';
import * as NQL from '../nql/nql'
import { Query } from '../query'
import { KeyMaster, Key, isNotInInput } from '../keymaster'

interface IIssuesState {
  items?: any[];
  selectedItemIndex?: number;
  selectedIssue?: IIssue;
  selectedTask?: ITask;
}

export class Issues extends React.Component<{}, IIssuesState> {
  private filterBox: FilterBox;
  private newAndUpdatedIssues: IIssue[] = [];
  private newAndUpdatedTasks: ITask[] = [];

  constructor() {
    super();

    this.state = {
      items: []
    };
  }

  componentDidMount() {
    var items = this.getFilteredItems();

    this.setState({
      items: items,
      selectedItemIndex: 0,
      selectedIssue: items[0]
    });

    Nautilus.Instance.on('issueAdded', (issue) => {
      this.newAndUpdatedIssues.push(issue);

      this.setState({
        items: this.getFilteredItems()
      })
    });

    Nautilus.Instance.on('issueChanged', (issue) => {
      this.newAndUpdatedIssues.push(issue);

      this.setState({
        items: this.getFilteredItems()
      })
    });

    Nautilus.Instance.on('issueDeleted', () => {
      this.setState({
        items: this.getFilteredItems()
      })
    });

    Nautilus.Instance.on('taskAdded', (task) => {
      this.newAndUpdatedTasks.push(task);

      this.setState({
        items: this.getFilteredItems()
      })
    });

    Nautilus.Instance.on('taskChanged', (task) => {
      this.newAndUpdatedTasks.push(task);

      this.setState({
        items: this.getFilteredItems()
      })
    });

    Nautilus.Instance.on('taskDeleted', () => {
      this.setState({
        items: this.getFilteredItems()
      })
    });

    Nautilus.Instance.on('refresh', () => {
      this.newAndUpdatedIssues = [];
      this.setState({
        items: this.getFilteredItems()
      })
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      KeyMaster.handle(event, { which: Key.N }, isNotInInput.bind(this), this.addIssue.bind(this));
      KeyMaster.handle(event, { which: Key.T }, isNotInInput.bind(this), this.addTask.bind(this));
      KeyMaster.handle(event, { which: Key.R }, isNotInInput.bind(this), this.refresh.bind(this));
    });

    ($(".detail-container") as any).sticky();
  }

  addIssue() {
    Nautilus.Instance.addIssue({} as IIssue);
  }

  addTask() {
    var task = {} as ITask;
    task.parent = this.state.selectedIssue;
    
    Nautilus.Instance.addTask(task);
  }

  refresh() {
    Nautilus.Instance.refresh();
  }

  getFilteredItems() {
    var filteredIssues = this.getFilteredIssues();
    var filteredTasks = this.getFilteredTasks();

    if (this.filterBox && this.filterBox.getIssueFilterQuery())
      filteredTasks = filteredTasks.filter(task => filteredIssues.some(issue => entityComparer(task.parent, issue)));

    if (this.filterBox && this.filterBox.getTaskFilterQuery())
      filteredIssues = filteredIssues.filter(issue => filteredTasks.some(task => entityComparer(task.parent, issue)));

    var items = filteredIssues.concat(filteredTasks);

    items = items.slice();
    items.sort((x: IIssue, y: IIssue) => {
      var xNodes = x.getParents();
      xNodes.reverse();
      xNodes.push(x);

      var yNodes = y.getParents();
      yNodes.reverse();
      yNodes.push(y);

      for (var i = 0; ; i++) {
        var xNode = xNodes[i];
        var yNode = yNodes[i];

        if (!xNode && !yNode)
          return 0;

        if (!xNode)
          return -1;

        if (!yNode)
          return 1;

        var result = xNode.sid.localeCompare(yNode.sid) * -1;

        if (result !== 0)
          return result;
      }
    });

    return items;
  }

  getFilteredIssues() {
    var issues = Nautilus.Instance.getIssues();

    var filterQuery = this.filterBox ? this.filterBox.getIssueFilterQuery() : null;

    if (filterQuery)
      issues = issues.filter(issue => this.newAndUpdatedIssues.some(entityComparer.bind(this, issue)) || Query.evaluateIssueFilter(filterQuery, issue));

    return issues;
  }

  getFilteredTasks() {
    var tasks = Nautilus.Instance.getTasks();

    var filterQuery = this.filterBox ? this.filterBox.getTaskFilterQuery() : null;

    if (filterQuery)
      tasks = tasks.filter(task => this.newAndUpdatedTasks.some(entityComparer.bind(this, task)) || Query.evaluateTaskFilter(filterQuery, task));

    return tasks;
  }

  onFiltersChanged(): void {
    this.newAndUpdatedIssues = [];
    this.newAndUpdatedTasks = [];
    var items = this.getFilteredItems();

    this.setState({
      items: items,
      selectedItemIndex: 0,
      selectedIssue: items[0],
      selectedTask: null
    })

    if (this.filterBox)
      this.saveFilterState(this.filterBox.getFilterState());
  }

  onSavedFiltersChanged(): void {
    this.saveSavedFilters(this.filterBox.getSavedFilters());
  }

  handleSelectionChange(index: number): void {
    this.setState({
      selectedItemIndex: index
    });

    var item = this.state.items[index];

    if (item.kind === 'issue')
      return this.setState({
        selectedIssue: item as IIssue,
        selectedTask: null
      });

    if (item.kind === 'task')
      return this.setState({
        selectedIssue: (item as ITask).getParent(),
        selectedTask: item as ITask
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

  saveTaskFilterState(filters: any) {
    sessionStorage.setItem('tasks/filters', JSON.stringify(filters));
  }

  loadSavedIssueFilters(): any {
    var item = localStorage.getItem('issues/saved-filters');

    if (!item)
      return item;

    return JSON.parse(item);
  }

  saveSavedFilters(savedFilters: any) {
    localStorage.setItem('issues/saved-filters', JSON.stringify(savedFilters));
  }

  loadSavedTaskFilters(): any {
    var item = localStorage.getItem('tasks/saved-filters');

    if (!item)
      return item;

    return JSON.parse(item);
  }

  saveSavedTaskFilters(savedFilters: any) {
    localStorage.setItem('tasks/saved-filters', JSON.stringify(savedFilters));
  }

  render() {
    return (
      <div>
        <Nav />
        <div className='row action-bar'>
          <div className='columns'>
            <button title='Shortcut: N' className="button-primary" onClick={this.addIssue.bind(this)}><i className='fa fa-plus before' aria-hidden='true'></i> Add Issue</button>
            <button title='Shortcut: T' className="button-primary" onClick={this.addTask.bind(this)}><i className='fa fa-plus before' aria-hidden='true'></i> Add Task</button>
            <button title='Shortcut: R' className="button" onClick={this.refresh.bind(this)}><i className='fa fa-refresh before after' aria-hidden='true'></i></button>
          </div>
        </div>
        <div className='row'>
          <div className='columns'>
            <FilterBox initialFilterState={this.loadFilterState()} initialSavedFilters={this.loadSavedIssueFilters()} onChanged={this.onFiltersChanged.bind(this)} onSavedFiltersChanged={this.onSavedFiltersChanged.bind(this)} ref={ref => this.filterBox = ref} />
          </div>
        </div>
        <div className='row'>
          <div className='two columns' style={{minHeight: '1px'}}>
            <div className='detail-container'>
              {
                this.state.selectedIssue ? <IssueDetail issue={this.state.selectedIssue} /> : null
              }
              {
                this.state.selectedTask ? <TaskDetail task={this.state.selectedTask} /> : null
              }
            </div>
          </div>
          <div className='ten columns'>
            <IssueList issues={this.state.items} selectedIssueIndex={this.state.selectedItemIndex} onSelectionChange={this.handleSelectionChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
};
