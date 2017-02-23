import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import * as NQL from '../../nql';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IFilterItem {
  id?: string;
  [key: string]: any;
};

interface IListFilterDropdownProps {
  items: IFilterItem[];
  displayProperty: string;
  query?: NQL.Expression;
  queryItem: string;
  queryItemType: string;
  itemToQueryItem: (item: IFilterItem) => Object;
  itemComparer: (item1: IFilterItem, item2: IFilterItem) => boolean;
  onChange(query: NQL.IExpression): void;
}

interface IListFilterDropdownState {
  items?: IFilterItem[];
  selectedItemIndex?: number;
  searchText?: string;
  includedItems?: IFilterItem[];
  excludedItems?: IFilterItem[];
}

export default class ListFilterDropdown extends React.Component<IListFilterDropdownProps, IListFilterDropdownState> {
  constructor(props: IListFilterDropdownProps) {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleItemExcludeClick = this.handleItemExcludeClick.bind(this);
    this.handleItemIncludeClick = this.handleItemIncludeClick.bind(this);
    this.handleItemTitleClick = this.handleItemTitleClick.bind(this);

    let { includedItems, excludedItems } = this.parseQuery(props.query, props);

    this.state = {
      items: props.items,
      selectedItemIndex: 0,
      includedItems,
      excludedItems,
    };
  }

  componentWillReceiveProps(nextProps: IListFilterDropdownProps) {
    let { includedItems, excludedItems } = this.parseQuery(nextProps.query, nextProps);

    this.setState({
      items: this.filterItems(nextProps.items, this.state.searchText),
      includedItems,
      excludedItems,
    });
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedItemIndex < this.state.items.length - 1) {
        this.setState({
          selectedItemIndex: this.state.selectedItemIndex + 1,
        });
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedItemIndex > 0) {
        this.setState({
          selectedItemIndex: this.state.selectedItemIndex - 1,
        });
      }
    }
    else if (event.which === KeyCode.Dash) {
      event.preventDefault();

      let selectedItem = this.state.items[this.state.selectedItemIndex];

      this.toggleItemExclude(selectedItem);
    }
    else if (event.which === KeyCode.Equals) {
      event.preventDefault();

      let selectedItem = this.state.items[this.state.selectedItemIndex];

      this.toggleItemInclude(selectedItem);
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      let selectedItem = this.state.items[this.state.selectedItemIndex];

      this.includeItem(selectedItem);
    }
  }

  private handleSearchTextChange(value: string) {
    this.setState({
      searchText: value,
      items: this.filterItems(this.props.items, value),
      selectedItemIndex: 0,
    });
  }

  private handleItemExcludeClick(item: IFilterItem) {
    this.toggleItemExclude(item);

    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private handleItemIncludeClick(item: IFilterItem) {
    this.toggleItemInclude(item);

    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private handleItemTitleClick(item: IFilterItem) {
    this.includeItem(item);

    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private filterItems(items: IFilterItem[], text: string) {
    if (!text)
      return items;

    text = text.toLowerCase().trim();

    return items.filter(item => item[this.props.displayProperty].toLowerCase().indexOf(text) !== -1);
  }

  private includeItem(item: IFilterItem) {
    let includedItems = [item];
    let excludedItems: IFilterItem[] = [];

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props));

    this.setState({
      includedItems,
      excludedItems,
    });
  }

  private toggleItemExclude(item: IFilterItem) {
    let includedItems: IFilterItem[] = [];
    let excludedItems = (this.state.excludedItems.indexOf(item) === -1) ? this.state.excludedItems.concat(item) : this.state.excludedItems.filter(x => x !== item);

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props));

    this.setState({
      includedItems,
      excludedItems,
    });
  }

  private toggleItemInclude(item: IFilterItem) {
    let includedItems = (this.state.includedItems.indexOf(item) === -1) ? this.state.includedItems.concat(item) : this.state.includedItems.filter(x => x !== item);
    let excludedItems: IFilterItem[] = [];

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props));

    this.setState({
      includedItems,
      excludedItems,
    });
  }

  private getQuery(includedItems: IFilterItem[], excludedItems: IFilterItem[], props: IListFilterDropdownProps): NQL.IExpression {
    if (includedItems.length === 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ConstantExpression(props.itemToQueryItem(includedItems[0]), props.queryItemType),
        '==');
    }

    if (includedItems.length > 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ListExpression(includedItems.map(item => new NQL.ConstantExpression(props.itemToQueryItem(item), props.queryItemType))),
        'IN');
    }

    if (excludedItems.length === 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ConstantExpression(props.itemToQueryItem(excludedItems[0]), props.queryItemType),
        '!=');
    }

    if (excludedItems.length > 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(props.queryItem),
        new NQL.ListExpression(excludedItems.map(item => new NQL.ConstantExpression(props.itemToQueryItem(item), props.queryItemType))),
        'NOT IN');
    }

    return null;
  }

  private parseQuery(query: NQL.Expression, props: IListFilterDropdownProps): { includedItems: IFilterItem[], excludedItems: IFilterItem[]} {
    if (!query)
      return {
        includedItems: [],
        excludedItems: [],
      };

    let comparisonQuery = query as NQL.ComparisonExpression;

    if (comparisonQuery.operator === '==') {
      let item = (comparisonQuery.right as NQL.ConstantExpression).value;

      return {
        includedItems: props.items.filter(x => props.itemComparer(x, item)),
        excludedItems: [],
      };
    }

    if (comparisonQuery.operator === 'IN') {
      let items = ((comparisonQuery.right as NQL.ListExpression).children).map(child => (child as NQL.ConstantExpression).value);

      return {
        includedItems: props.items.filter(x => items.some(item => props.itemComparer(item, x))),
        excludedItems: [],
      };
    }

    if (comparisonQuery.operator === '!=') {
      let item = (comparisonQuery.right as NQL.ConstantExpression).value;

      return {
        includedItems: [],
        excludedItems: props.items.filter(x => props.itemComparer(x, item)),
      };
    }

    if (comparisonQuery.operator === 'NOT IN') {
      let items = ((comparisonQuery.right as NQL.ListExpression).children).map(child => (child as NQL.ConstantExpression).value);

      return {
        includedItems: [],
        excludedItems: props.items.filter(x => items.some(item => props.itemComparer(item, x))),
      };
    }

    throw new Error('Not supported.');
  }

  static canParseQuery(query: NQL.Expression, queryItem: string, queryItemType: string) {
    if (!(query instanceof NQL.ComparisonExpression))
      return false;

    if (!(query.left instanceof NQL.LocalExpression))
      return false;

    if (query.left.name !== queryItem)
      return false;

    if (query.operator === '==' || query.operator === '!=') {
      if (!(query.right instanceof NQL.ConstantExpression))
        return false;

      if (query.right.returnType !== queryItemType)
        return false;

      return true;
    }

    if (query.operator === 'IN' || query.operator === 'NOT IN') {
      if (!(query.right instanceof NQL.ListExpression))
        return false;

      if (!query.right.children.every(child => child instanceof NQL.ConstantExpression && child.returnType === queryItemType))
        return false;

      return true;
    }

    return false;
  }

  render() {
    return (
      <div className="list-filter-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="items">
          {
            this.state.items.map((item, index) => {
              return (
                <div className={classNames('item', {'selected': index === this.state.selectedItemIndex})} key={item.id}>
                  <a className={classNames('exclude', {'selected': this.state.excludedItems.indexOf(item) !== -1})} href="#" onClick={_.partial(this.handleItemExcludeClick, item)}>
                    <Icon name="minus-square" />
                  </a>
                  <a className={classNames('include', {'selected': this.state.includedItems.indexOf(item) !== -1})} href="#" onClick={_.partial(this.handleItemIncludeClick, item)}>
                    <Icon name="plus-square" />
                  </a>
                  <a className="title" href="#" onClick={_.partial(this.handleItemTitleClick, item)}>
                    {item[this.props.displayProperty]}
                  </a>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
};
