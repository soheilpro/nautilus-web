import * as React from 'react'
import { Nautilus, entityComparer, asEntity } from '../nautilus'
import * as NQL from '../nql/nql'
import { HTMLExpressionFormatter } from '../expressions/htmlexpressionformatter'
import { KeyMaster, Key, isNotInInput } from '../keymaster'

interface IFilterItem {
  key: string;
  title: string;
  isIncluded: boolean;
  isExcluded: boolean;
  queryItem: Object;
  queryReturnType: string;
}

interface IFilterGroup {
  key: string;
  title: string;
  items: IFilterItem[];
  queryItem: string;
}

interface IFilterState {
  type: string;
  groups: {
    key: string;
    include: string[];
    exclude: string[];
  }[]
}

interface FilterBoxProps {
  filterState: IFilterState;
  onChanged(): void;
}

interface FilterBoxState {
  groups: IFilterGroup[];
}

export class FilterBox extends React.Component<FilterBoxProps, FilterBoxState> {
  constructor() {
    super();

    this.state = {
      groups: []
    };

    this.state.groups.push({
      key: 'milestone',
      title: 'Milestone',
      items: Nautilus.Instance.getMilestones().map(milestone => {
        return {
          key: milestone.id,
          title: milestone.getFullTitle(),
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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
          isIncluded: false,
          isExcluded: false,
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

    if (this.props.filterState) {
      this.state.groups.forEach(group => {
        group.items.forEach(item => {
          var groupState = this.props.filterState.groups.filter(x => x.key === group.key)[0];

          if (!groupState)
            return;

          item.isIncluded = groupState.include.some(x => x === item.key);
          item.isExcluded = groupState.exclude.some(x => x === item.key);
        });
      });

      this.props.onChanged();
    }
  }

  private areAnyItemsSelected() {
    return this.state.groups.some(group => {
      return group.items.some(item => {
        return item.isIncluded || item.isExcluded;
      });
    });
  }

  private clearFilters() {
    this.state.groups.forEach(group => {
      group.items.forEach(item => {
        item.isIncluded = false;
        item.isExcluded = false;
      });
    });

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemSelected(item: IFilterItem, group: IFilterGroup) {
    this.state.groups.forEach(group2 => {
      group2.items.forEach(item2 => {
        item2.isIncluded = (group2.key === group.key && item2.key === item.key);
        item2.isExcluded = false;
      });
    });

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemIncluded(item: IFilterItem, group: IFilterGroup) {
    item.isIncluded = !item.isIncluded;

    group.items.forEach(i => {
      i.isExcluded = false;
    });

    this.forceUpdate();
    this.props.onChanged();
  }

  private onItemExcluded(item: IFilterItem, group: IFilterGroup) {
    group.items.forEach(i => {
      i.isIncluded = false;
    });

    item.isExcluded = !item.isExcluded;

    this.forceUpdate();
    this.props.onChanged();
  }

  private toggleFilters() {
    $('.filter-box .body').slideToggle({
      duration: 300
    });
  }

  getFilterState(): IFilterState {
    return {
      type: 'simple',
      groups: this.state.groups.map(group => {
        return {
          key: group.key,
          include: group.items.filter(item => item.isIncluded).map(item => item.key),
          exclude: group.items.filter(item => item.isExcluded).map(item => item.key)
        };
      })
    };
  }

  getQuery(): NQL.IExpression {
    var expressions: NQL.IExpression[] = [];

    this.state.groups.forEach(group => {
      var includedItems = group.items.filter(item => item.isIncluded);
      var excludedItems = group.items.filter(item => item.isExcluded);

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
      <div className='filter-box'>
        <div className='header' onClick={this.toggleFilters.bind(this)} title='Shortcut: F'>
          <span className='title'>Filter:</span>
          <span className='query'>{this.renderQuery(this.getQuery())}</span>
        </div>
        <div className='body'>
          <a href='#' style={{display: this.areAnyItemsSelected() ? 'inline' : 'none'}} className='clear' onClick={this.clearFilters.bind(this)}>Clear</a>
          {
            this.state.groups.map((group) => {
              return (
                <div className='filter-group' key={group.key}>
                  <span className='title'>{group.title}</span>
                  {
                    group.items.map((item) => {
                      return (
                        <div className={classNames('filter-item', {'selected': item.isIncluded || item.isExcluded})} key={item.key}>
                          <a href='#' onClick={this.onItemSelected.bind(this, item, group)}>{item.title}</a>
                          <i className={classNames('checkbox exclude fa fa-minus-square', {'selected': item.isExcluded})} title='Exclude' aria-hidden='true' onClick={this.onItemExcluded.bind(this, item, group)}></i>
                          <i className={classNames('checkbox include fa fa-plus-square', {'selected': item.isIncluded})} title='Include' aria-hidden='true' onClick={this.onItemIncluded.bind(this, item, group)}></i>
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
