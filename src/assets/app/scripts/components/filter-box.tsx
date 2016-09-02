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

interface FilterBoxProps {
  initialFilterState: IFilterState;
  initialSavedFilters: ISavedFilter[];
  onChanged(): void;
  onSavedFiltersChanged(): void;
}

interface FilterBoxState {
  groups: IFilterGroup[];
  filterState: IFilterState;
  savedFilters: ISavedFilter[];
}

export class FilterBox extends React.Component<FilterBoxProps, FilterBoxState> {
  private filterBoxElement: HTMLElement;
  private bodyElement: HTMLElement;

  constructor() {
    super();

    this.state = {
      groups: [],
      filterState: {
        include: [],
        exclude: []
      },
      savedFilters: []
    };

    this.state.groups.push({
      key: 'milestone',
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

    this.state.groups.push({
      key: 'project',
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

    this.state.groups.push({
      key: 'area',
      title: 'Area',
      items: Nautilus.Instance.getItemAreas().map(itemArea => {
        return {
          key: itemArea.id,
          title: itemArea.title,
          queryItem: asEntity(itemArea),
          queryReturnType: 'ItemArea'
        };
      }),
      queryItem: 'area'
    });

    this.state.groups.push({
      key: 'type',
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

    this.state.groups.push({
      key: 'priority',
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

    this.state.groups.push({
      key: 'state',
      title: 'State',
      items: Nautilus.Instance.getItemStates().map(itemState => {
        return {
          key: itemState.id,
          title: itemState.title,
          queryItem: asEntity(itemState),
          queryReturnType: 'ItemState'
        };
      }),
      queryItem: 'state'
    });

    this.state.groups.push({
      key: 'assignee',
      title: 'Assignee',
      items: Nautilus.Instance.getUsers().map(user => {
        return {
          key: user.id,
          title: user.name,
          queryItem: asEntity(user),
          queryReturnType: 'User'
        };
      }),
      queryItem: 'assignee'
    });

    this.state.groups.push({
      key: 'creator',
      title: 'Creator',
      items: Nautilus.Instance.getUsers().map(user => {
        return {
          key: user.id,
          title: user.name,
          queryItem: asEntity(user),
          queryReturnType: 'User'
        };
      }),
      queryItem: 'creator'
    });
  }

  private componentWillMount() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      KeyMaster.handle(event, { which: Key.F }, isNotInInput.bind(this), this.toggleFilters.bind(this));
    });

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

  private onItemSelected(item: IFilterItem, group: IFilterGroup) {
    this.state.filterState.include = [{
      groupKey: group.key,
      itemKey: item.key
    }];

    this.state.filterState.exclude = [];

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemIncluded(item: IFilterItem, group: IFilterGroup) {
    this.state.filterState.include.push({
      groupKey: group.key,
      itemKey: item.key
    });

    this.state.filterState.exclude = this.state.filterState.exclude.filter(x => x.groupKey !== group.key);

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemDeIncluded(item: IFilterItem, group: IFilterGroup) {
    this.state.filterState.include = this.state.filterState.include.filter(x => x.groupKey !== group.key || (x.groupKey === group.key && x.itemKey !== item.key));

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemExcluded(item: IFilterItem, group: IFilterGroup) {
    this.state.filterState.include = this.state.filterState.include.filter(x => x.groupKey !== group.key);

    this.state.filterState.exclude.push({
      groupKey: group.key,
      itemKey: item.key
    });

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemDeExcluded(item: IFilterItem, group: IFilterGroup) {
    this.state.filterState.exclude = this.state.filterState.exclude.filter(x => x.groupKey !== group.key || (x.groupKey === group.key && x.itemKey !== item.key));

    this.forceUpdate();
    this.props.onChanged();
  }

  private onSavedFilterSelected(savedFilter: ISavedFilter) {
    this.state.filterState = savedFilter.state;

    this.forceUpdate();
    this.props.onChanged();
  }

  private toggleFilters() {
    $(this.filterBoxElement).toggleClass('open');
    $(this.bodyElement).slideToggle({
      duration: 300
    });
  }

  getFilterState(): IFilterState {
    return JSON.parse(JSON.stringify(this.state.filterState));
  }

  getSavedFilters(): ISavedFilter[] {
    return JSON.parse(JSON.stringify(this.state.savedFilters));
  }

  getQuery(): NQL.IExpression {
    var expressions: NQL.IExpression[] = [];

    this.state.groups.forEach(group => {
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

  private isIncluded(item: IFilterItem, group: IFilterGroup) {
    return this.state.filterState.include.some(x => x.groupKey === group.key && x.itemKey === item.key);
  }

  private isExcluded(item: IFilterItem, group: IFilterGroup) {
    return this.state.filterState.exclude.some(x => x.groupKey === group.key && x.itemKey === item.key);
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
          <span className='title'>Filter:</span>
          <span className='query'>{this.renderQuery(this.getQuery())}</span>
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
        <div className='toggle' onClick={this.toggleFilters.bind(this)} title='Shortcut: F'>
          <i className='open fa fa-angle-double-down' aria-hidden='true'></i>
          <i className='close fa fa-angle-double-up' aria-hidden='true'></i>
        </div>
        <div className='body' ref={e => this.bodyElement = e}>
          {
            this.state.groups.map((group) => {
              return (
                <div className='filter-group' key={group.key}>
                  <span className='title'>{group.title}</span>
                  {
                    group.items.map((item) => {
                      return (
                        <div className={classNames('filter-item', {'selected': this.isIncluded(item, group) || this.isExcluded(item, group)})} key={item.key}>
                          <a href='#' onClick={this.onItemSelected.bind(this, item, group)}>{item.title}</a>
                          {
                            !this.isExcluded(item, group) ?
                              <i className='checkbox exclude fa fa-minus-square' title='Exclude' aria-hidden='true' onClick={this.onItemExcluded.bind(this, item, group)}></i> :
                              <i className='checkbox exclude fa fa-minus-square selected' title='Exclude' aria-hidden='true' onClick={this.onItemDeExcluded.bind(this, item, group)}></i>
                          }
                          {
                            !this.isIncluded(item, group) ?
                              <i className='checkbox include fa fa-plus-square' title='Include' aria-hidden='true' onClick={this.onItemIncluded.bind(this, item, group)}></i> :
                              <i className='checkbox include fa fa-plus-square selected' title='Include' aria-hidden='true' onClick={this.onItemDeIncluded.bind(this, item, group)}></i>
                          }
                        </div>
                      )
                    }, this)
                  }
                </div>
              )
            }, this)
          }
          <div className='clear'></div>
        </div>
      </div>
    );
  }
}
