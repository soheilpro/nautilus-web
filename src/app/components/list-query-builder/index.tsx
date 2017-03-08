import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import * as NQL from '../../nql';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItem {
  id?: string;
  [key: string]: any;
};

interface IListQueryBuilderProps {
  items: IItem[];
  displayProperty: string;
  query?: NQL.Expression;
  queryItem: string;
  queryItemType: string;
  itemToQueryItem: (item: IItem) => Object;
  itemComparer: (item1: IItem, item2: IItem) => boolean;
  onChange(query: NQL.IExpression, done: boolean): void;
}

interface IListQueryBuilderState {
  items?: IItem[];
  selectedItemIndex?: number;
  searchText?: string;
  includedItems?: IItem[];
  excludedItems?: IItem[];
}

export default class ListQueryBuilder extends React.Component<IListQueryBuilderProps, IListQueryBuilderState> {
  constructor(props: IListQueryBuilderProps) {
    super();

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this);
    this.handleItemExcludeClick = this.handleItemExcludeClick.bind(this);
    this.handleItemIncludeClick = this.handleItemIncludeClick.bind(this);
    this.handleItemTitleClick = this.handleItemTitleClick.bind(this);

    const { includedItems, excludedItems } = this.parseQuery(props.query, props);

    this.state = {
      items: props.items,
      selectedItemIndex: 0,
      includedItems,
      excludedItems,
    };
  }

  componentWillReceiveProps(props: IListQueryBuilderProps) {
    const { includedItems, excludedItems } = this.parseQuery(props.query, props);

    this.setState({
      items: this.filterItems(props.items, this.state.searchText),
      includedItems,
      excludedItems,
    });
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState({
        selectedItemIndex: this.state.selectedItemIndex < this.state.items.length - 1 ? this.state.selectedItemIndex + 1 : 0,
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState({
        selectedItemIndex: this.state.selectedItemIndex > 0 ? this.state.selectedItemIndex - 1 : this.state.items.length - 1,
      });
    }
    else if (event.which === KeyCode.Dash) {
      event.preventDefault();

      const selectedItem = this.state.items[this.state.selectedItemIndex];

      this.toggleItemExclude(selectedItem);
    }
    else if (event.which === KeyCode.Equals) {
      event.preventDefault();

      const selectedItem = this.state.items[this.state.selectedItemIndex];

      this.toggleItemInclude(selectedItem);
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      const selectedItem = this.state.items[this.state.selectedItemIndex];

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

  private handleItemMouseEnter(item: IItem) {
    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private handleItemExcludeClick(item: IItem, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.toggleItemExclude(item);

    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private handleItemIncludeClick(item: IItem, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.toggleItemInclude(item);

    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private handleItemTitleClick(item: IItem, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.includeItem(item);

    this.setState({
      selectedItemIndex: this.state.items.indexOf(item),
    });
  }

  private filterItems(items: IItem[], text: string) {
    if (!text)
      return items;

    text = text.toLowerCase().trim();

    return items.filter(item => item[this.props.displayProperty].toLowerCase().indexOf(text) !== -1);
  }

  private includeItem(item: IItem) {
    const includedItems = [item];
    const excludedItems: IItem[] = [];

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props), true);

    this.setState({
      includedItems,
      excludedItems,
    });
  }

  private toggleItemExclude(item: IItem) {
    const includedItems: IItem[] = [];
    const excludedItems = (this.state.excludedItems.indexOf(item) === -1) ? this.state.excludedItems.concat(item) : this.state.excludedItems.filter(x => x !== item);

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props), false);

    this.setState({
      includedItems,
      excludedItems,
    });
  }

  private toggleItemInclude(item: IItem) {
    const includedItems = (this.state.includedItems.indexOf(item) === -1) ? this.state.includedItems.concat(item) : this.state.includedItems.filter(x => x !== item);
    const excludedItems: IItem[] = [];

    this.props.onChange(this.getQuery(includedItems, excludedItems, this.props), false);

    this.setState({
      includedItems,
      excludedItems,
    });
  }

  private getQuery(includedItems: IItem[], excludedItems: IItem[], props: IListQueryBuilderProps): NQL.IExpression {
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

  private parseQuery(query: NQL.Expression, props: IListQueryBuilderProps): { includedItems: IItem[], excludedItems: IItem[]} {
    if (!query)
      return {
        includedItems: [],
        excludedItems: [],
      };

    const comparisonQuery = query as NQL.ComparisonExpression;

    if (comparisonQuery.operator === '==') {
      const item = (comparisonQuery.right as NQL.ConstantExpression).value;

      return {
        includedItems: props.items.filter(x => props.itemComparer(x, item)),
        excludedItems: [],
      };
    }

    if (comparisonQuery.operator === 'IN') {
      const items = ((comparisonQuery.right as NQL.ListExpression).children).map(child => (child as NQL.ConstantExpression).value);

      return {
        includedItems: props.items.filter(x => items.some(item => props.itemComparer(item, x))),
        excludedItems: [],
      };
    }

    if (comparisonQuery.operator === '!=') {
      const item = (comparisonQuery.right as NQL.ConstantExpression).value;

      return {
        includedItems: [],
        excludedItems: props.items.filter(x => props.itemComparer(x, item)),
      };
    }

    if (comparisonQuery.operator === 'NOT IN') {
      const items = ((comparisonQuery.right as NQL.ListExpression).children).map(child => (child as NQL.ConstantExpression).value);

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
      <div className="list-query-builder-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="item-list">
          {
            this.state.items.length > 0 ?
              this.state.items.map((item, index) => {
                return (
                  <div className={classNames('item', {'selected': index === this.state.selectedItemIndex})} onMouseEnter={_.partial(this.handleItemMouseEnter, item)} key={item.id}>
                    <a className={classNames('exclude', {'selected': this.state.excludedItems.indexOf(item) !== -1})} href="#" title="Exclude" onClick={_.partial(this.handleItemExcludeClick, item)}>
                      <Icon name="minus-square" />
                    </a>
                    <a className={classNames('include', {'selected': this.state.includedItems.indexOf(item) !== -1})} href="#" title="Include" onClick={_.partial(this.handleItemIncludeClick, item)}>
                      <Icon name="plus-square" />
                    </a>
                    <a className="title" href="#" onClick={_.partial(this.handleItemTitleClick, item)}>
                      {item[this.props.displayProperty]}
                    </a>
                  </div>
                );
              })
              :
              <div className="no-items-found">
                  No items found.
              </div>
          }
        </div>
      </div>
    );
  }
};
