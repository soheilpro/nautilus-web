import * as React from 'react'
import { Nautilus, entityComparer, asEntity } from '../nautilus'
import * as NQL from '../nql/nql'
import { HTMLExpressionFormatter } from '../expressions/htmlexpressionformatter'
import { KeyMaster, Key, isNotInInput } from '../keymaster'

interface IFilterItem {
  key: string;
  title: string;
  queryItem: Object;
  queryReturnType: string;
}

interface IFilterGroup {
  key: string;
  title: string;
  items: IFilterItem[];
  queryItem: string;
}

interface IFilterSelection {
  groupKey: string;
  itemKey: string;
}

interface IFilterState {
  include: IFilterSelection[],
  exclude: IFilterSelection[]
}

interface ISavedFilter {
  name: string;
  state: IFilterState;
}

interface FilterGroupProps {
  group: IFilterGroup;
  filterState: IFilterState;
  onItemSelected(item: IFilterItem): void;
  onItemIncluded(item: IFilterItem): void;
  onItemDeIncluded(item: IFilterItem): void;
  onItemExcluded(item: IFilterItem): void;
  onItemDeExcluded(item: IFilterItem): void;
}

interface FilterGroupState {
  isOpen?: boolean;
  searchTerm?: string;
}

export class FilterGroup extends React.Component<FilterGroupProps, FilterGroupState> {
  private containerElement: Element;
  private searchInputElement: Element;

  constructor() {
    super();

    this.state = {
      isOpen: false
    }
  }

  componentWillMount() {
    window.addEventListener('click', (event: Event) => {
      if ($(this.containerElement).has(event.target as Element).length === 0)
        this.setState({
          isOpen: false
        });
    });
  }

  componentDidUpdate() {
    if (this.state.isOpen)
      $(this.searchInputElement).focus();
  }

  private toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
      searchTerm: ''
    });
  }

  private handleSearchInputChange(event: Event) {
    this.setState({
      searchTerm: (event.target as HTMLInputElement).value
    })
  }

  private handleSearchInputKeyDown(event: KeyboardEvent) {
    if (event.which === Key.Escape)
      this.setState({
        isOpen: false
      })
  }

  private isIncluded(item: IFilterItem) {
    return this.props.filterState.include.some(x => x.groupKey === this.props.group.key && x.itemKey === item.key);
  }

  private isExcluded(item: IFilterItem) {
    return this.props.filterState.exclude.some(x => x.groupKey === this.props.group.key && x.itemKey === item.key);
  }

  render() {
    return (
      <div className={classNames('filter-group', {'open': this.state.isOpen})} key={this.props.group.key} ref={e => this.containerElement = e}>
        <button className='title' onClick={this.toggle.bind(this)}>
          {this.props.group.title}
          <i className='fa fa-caret-down caret caret-down' aria-hidden="true"></i>
          <i className='fa fa-caret-up caret caret-up' aria-hidden="true"></i>
        </button>
        <div className='content'>
          <div className='search'>
            <input value={this.state.searchTerm} type='text' className='input' onChange={this.handleSearchInputChange.bind(this)} onKeyDown={this.handleSearchInputKeyDown.bind(this)} ref={e => this.searchInputElement = e} />
          </div>
        {
          this.props.group.items.filter(item => !this.state.searchTerm || item.title.toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1).map((item) => {
            return (
              <div className={classNames('filter-item', {'selected': this.isIncluded(item) || this.isExcluded(item)})} key={item.key}>
                {
                  !this.isExcluded(item) ?
                    <i className='checkbox exclude fa fa-minus-square' title='Exclude' aria-hidden='true' onClick={this.props.onItemExcluded.bind(this, item)}></i> :
                    <i className='checkbox exclude fa fa-minus-square selected' title='Exclude' aria-hidden='true' onClick={this.props.onItemDeExcluded.bind(this, item)}></i>
                }
                {
                  !this.isIncluded(item) ?
                    <i className='checkbox include fa fa-plus-square' title='Include' aria-hidden='true' onClick={this.props.onItemIncluded.bind(this, item)}></i> :
                    <i className='checkbox include fa fa-plus-square selected' title='Include' aria-hidden='true' onClick={this.props.onItemDeIncluded.bind(this, item)}></i>
                }
                <a href='#' onClick={this.props.onItemSelected.bind(this, item)}>{item.title}</a>
              </div>
            )
          }, this)
        }
        </div>
      </div>
    );
  }
}

interface FilterBoxProps {
  initialFilterState: IFilterState;
  initialSavedFilters: ISavedFilter[];
  onChanged(): void;
  onSavedFiltersChanged(): void;
}

interface FilterBoxState {
  issueGroups: IFilterGroup[];
  taskGroups: IFilterGroup[];
  filterState: IFilterState;
  savedFilters: ISavedFilter[];
}

export class FilterBox extends React.Component<FilterBoxProps, FilterBoxState> {
  private filterBoxElement: HTMLElement;
  private bodyElement: HTMLElement;

  constructor() {
    super();

    this.state = {
      issueGroups: [],
      taskGroups: [],
      filterState: {
        include: [],
        exclude: []
      },
      savedFilters: []
    };

    this.state.issueGroups.push({
      key: 'issue.milestone',
      title: 'Milestone',
      items: Nautilus.Instance.getMilestones().map(milestone => {
        return {
          key: milestone.id,
          title: milestone.getFullTitle(),
          queryItem: asEntity(milestone),
          queryReturnType: 'Milestone'
        };
      }),
      queryItem: 'milestone'
    });

    this.state.issueGroups.push({
      key: 'issue.project',
      title: 'Project',
      items: Nautilus.Instance.getProjects().map(project => {
        return {
          key: project.id,
          title: project.name,
          queryItem: asEntity(project),
          queryReturnType: 'Project'
        };
      }),
      queryItem: 'project'
    });

    this.state.issueGroups.push({
      key: 'issue.type',
      title: 'Type',
      items: Nautilus.Instance.getIssueTypes().map(itemType => {
        return {
          key: itemType.id,
          title: itemType.title,
          queryItem: asEntity(itemType),
          queryReturnType: 'ItemType'
        };
      }),
      queryItem: 'type'
    });

    this.state.issueGroups.push({
      key: 'issue.priority',
      title: 'Priority',
      items: Nautilus.Instance.getItemPriorities().map(itemPriority => {
        return {
          key: itemPriority.id,
          title: itemPriority.title,
          queryItem: asEntity(itemPriority),
          queryReturnType: 'ItemPriority'
        };
      }),
      queryItem: 'priority'
    });

    this.state.issueGroups.push({
      key: 'issue.state',
      title: 'State',
      items: Nautilus.Instance.getIssueStates().map(issueState => {
        return {
          key: issueState.id,
          title: issueState.title,
          queryItem: asEntity(issueState),
          queryReturnType: 'ItemState'
        };
      }),
      queryItem: 'state'
    });

    this.state.issueGroups.push({
      key: 'issue.createdBy',
      title: 'Created By',
      items: Nautilus.Instance.getUsers().map(user => {
        return {
          key: user.id,
          title: user.name,
          queryItem: asEntity(user),
          queryReturnType: 'User'
        };
      }),
      queryItem: 'createdBy'
    });

    this.state.taskGroups.push({
      key: 'task.type',
      title: 'Type',
      items: Nautilus.Instance.getTaskTypes().map(taskType => {
        return {
          key: taskType.id,
          title: taskType.title,
          queryItem: asEntity(taskType),
          queryReturnType: 'ItemType'
        };
      }),
      queryItem: 'type'
    });

    this.state.taskGroups.push({
      key: 'task.state',
      title: 'State',
      items: Nautilus.Instance.getTaskStates().map(taskState => {
        return {
          key: taskState.id,
          title: taskState.title,
          queryItem: asEntity(taskState),
          queryReturnType: 'ItemState'
        };
      }),
      queryItem: 'state'
    });

    this.state.taskGroups.push({
      key: 'task.assignedTo',
      title: 'Assigned To',
      items: Nautilus.Instance.getUsers().map(user => {
        return {
          key: user.id,
          title: user.name,
          queryItem: asEntity(user),
          queryReturnType: 'User'
        };
      }),
      queryItem: 'assignedTo'
    });

    this.state.taskGroups.push({
      key: 'task.createdBy',
      title: 'Created By',
      items: Nautilus.Instance.getUsers().map(user => {
        return {
          key: user.id,
          title: user.name,
          queryItem: asEntity(user),
          queryReturnType: 'User'
        };
      }),
      queryItem: 'createdBy'
    });
  }

  private componentWillMount() {
    if (this.props.initialFilterState) {
      this.state.filterState = this.props.initialFilterState;
      this.props.onChanged();
    }

    if (this.props.initialSavedFilters)
      this.state.savedFilters = this.props.initialSavedFilters;
  }

  private areAnyItemsSelected() {
    return this.state.filterState.include.length > 0 || this.state.filterState.exclude.length > 0;
  }

  private clearFilters() {
    this.state.filterState = {
      include: [],
      exclude: []
    };

    this.forceUpdate();
    this.props.onChanged();
  }

  private saveFilter() {
    var name = window.prompt('Name?');

    if (!name)
      return;

    this.state.savedFilters.push({
      name: name,
      state: this.getFilterState()
    });

    this.forceUpdate();
    this.props.onSavedFiltersChanged();
  }

  private removeSavedFilter(savedFilter: ISavedFilter) {
    this.state.savedFilters = this.state.savedFilters.filter(x => x !== savedFilter);

    this.forceUpdate();
    this.props.onSavedFiltersChanged();
  }

  private onItemSelected(group: IFilterGroup, item: IFilterItem) {
    this.state.filterState = {
      include: [{
        groupKey: group.key,
        itemKey: item.key
      }],
      exclude: []
    };

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemIncluded(group: IFilterGroup, item: IFilterItem) {
    this.state.filterState = {
      include: this.state.filterState.include.concat([{
        groupKey: group.key,
        itemKey: item.key
      }]),
      exclude: this.state.filterState.exclude.filter(x => x.groupKey !== group.key)
    };

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemDeIncluded(group: IFilterGroup, item: IFilterItem) {
    this.state.filterState = {
      include: this.state.filterState.include.filter(x => x.groupKey !== group.key || (x.groupKey === group.key && x.itemKey !== item.key)),
      exclude: this.state.filterState.exclude
    };

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemExcluded(group: IFilterGroup, item: IFilterItem) {
    this.state.filterState = {
      include: this.state.filterState.include.filter(x => x.groupKey !== group.key),
      exclude: this.state.filterState.exclude.concat([{
        groupKey: group.key,
        itemKey: item.key
      }])
    };

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemDeExcluded(group: IFilterGroup, item: IFilterItem) {
    this.state.filterState = {
      include: this.state.filterState.include,
      exclude: this.state.filterState.exclude.filter(x => x.groupKey !== group.key || (x.groupKey === group.key && x.itemKey !== item.key))
    };

    this.forceUpdate();
    this.props.onChanged();
  }

  private onSavedFilterSelected(savedFilter: ISavedFilter) {
    this.state.filterState = savedFilter.state;

    this.forceUpdate();
    this.props.onChanged();
  }

  getFilterState(): IFilterState {
    return JSON.parse(JSON.stringify(this.state.filterState));
  }

  getSavedFilters(): ISavedFilter[] {
    return JSON.parse(JSON.stringify(this.state.savedFilters));
  }

  getIssueFilterQuery(): NQL.IExpression {
    var expressions: NQL.IExpression[] = [];

    this.state.issueGroups.forEach(group => {
      var includedItems = group.items.filter(item => this.state.filterState.include.some(x => x.groupKey === group.key && x.itemKey === item.key));
      var excludedItems = group.items.filter(item => this.state.filterState.exclude.some(x => x.groupKey === group.key && x.itemKey === item.key));

      if (includedItems.length === 0) {
        // noop
      }
      else if (includedItems.length === 1) {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ConstantExpression(includedItems[0].queryItem, includedItems[0].queryReturnType),
          '=='));
      }
      else {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ListExpression(includedItems.map(item => new NQL.ConstantExpression(item.queryItem, item.queryReturnType))),
          'IN'));
      }

      if (excludedItems.length === 0) {
        // noop
      }
      else if (excludedItems.length === 1) {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ConstantExpression(excludedItems[0].queryItem, excludedItems[0].queryReturnType),
          '!='));
      }
      else {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ListExpression(excludedItems.map(item => new NQL.ConstantExpression(item.queryItem, item.queryReturnType))),
          'NOT IN'));
      }
    });

    if (expressions.length === 0)
      return null;

    return new NQL.AndExpression(expressions);
  }

  getTaskFilterQuery(): NQL.IExpression {
    var expressions: NQL.IExpression[] = [];

    this.state.taskGroups.forEach(group => {
      var includedItems = group.items.filter(item => this.state.filterState.include.some(x => x.groupKey === group.key && x.itemKey === item.key));
      var excludedItems = group.items.filter(item => this.state.filterState.exclude.some(x => x.groupKey === group.key && x.itemKey === item.key));

      if (includedItems.length === 0) {
        // noop
      }
      else if (includedItems.length === 1) {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ConstantExpression(includedItems[0].queryItem, includedItems[0].queryReturnType),
          '=='));
      }
      else {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ListExpression(includedItems.map(item => new NQL.ConstantExpression(item.queryItem, item.queryReturnType))),
          'IN'));
      }

      if (excludedItems.length === 0) {
        // noop
      }
      else if (excludedItems.length === 1) {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ConstantExpression(excludedItems[0].queryItem, excludedItems[0].queryReturnType),
          '!='));
      }
      else {
        expressions.push(new NQL.ComparisonExpression(
          new NQL.LocalExpression(group.queryItem),
          new NQL.ListExpression(excludedItems.map(item => new NQL.ConstantExpression(item.queryItem, item.queryReturnType))),
          'NOT IN'));
      }
    });

    if (expressions.length === 0)
      return null;

    return new NQL.AndExpression(expressions);
  }

  renderQuery(query: NQL.IExpression) {
    if (!query)
      return <span>All</span>;

    return (
      <span dangerouslySetInnerHTML={{ __html: new HTMLExpressionFormatter().format(query, null) }} />
    );
  }

  render() {
    return (
      <div className='filter-box' ref={e => this.filterBoxElement = e}>
        <div className='header'>
          <span className='title'>Issues:</span>
          <span className='query'>{this.renderQuery(this.getIssueFilterQuery())}</span>
          <span className='title'>Tasks:</span>
          <span className='query'>{this.renderQuery(this.getTaskFilterQuery())}</span>
          {
            this.areAnyItemsSelected() ?
              <a href='#' className='save' onClick={this.saveFilter.bind(this)}>Save</a> : null
          }
          <span className='saved-filters'>
          {
            _.sortBy(this.state.savedFilters, 'name').map((savedFilter) => {
              return (
                <span className='saved-filter'>
                  <a href='#' className='delete' onClick={this.removeSavedFilter.bind(this, savedFilter)}><i className="fa fa-remove" aria-hidden="true"></i></a>
                  <a href='#' className='filter' onClick={this.onSavedFilterSelected.bind(this, savedFilter)}>{savedFilter.name}</a>
                </span>
              )
            }, this)
          }
          </span>
          {
            this.areAnyItemsSelected() ?
              <a href='#' className='all' onClick={this.clearFilters.bind(this)}>All</a> : null
          }
          <div className='clear'></div>
        </div>
        <div className='body' ref={e => this.bodyElement = e}>
          {
            this.state.issueGroups.map((group) => {
              return <FilterGroup group={group} filterState={this.state.filterState} onItemSelected={this.onItemSelected.bind(this, group)} onItemIncluded={this.onItemIncluded.bind(this, group)} onItemDeExcluded={this.onItemDeExcluded.bind(this, group)} onItemExcluded={this.onItemExcluded.bind(this, group)} onItemDeIncluded={this.onItemDeIncluded.bind(this, group)} />
            }, this)
          }
        </div>
        <div className='body' ref={e => this.bodyElement = e}>
          {
            this.state.taskGroups.map((group) => {
              return <FilterGroup group={group} filterState={this.state.filterState} onItemSelected={this.onItemSelected.bind(this, group)} onItemIncluded={this.onItemIncluded.bind(this, group)} onItemDeExcluded={this.onItemDeExcluded.bind(this, group)} onItemExcluded={this.onItemExcluded.bind(this, group)} onItemDeIncluded={this.onItemDeIncluded.bind(this, group)} />
            }, this)
          }
          <div className='clear'></div>
        </div>
      </div>
    );
  }
}
