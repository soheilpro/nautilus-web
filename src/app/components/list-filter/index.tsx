import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import * as NQL from '../../nql';
import { KeyCode } from '../../keyboard';
import Dropdown from '../dropdown';
import Input from '../input';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IFilterItem {
  id?: string;
  [key: string]: any;
};

interface IListFilterDropdownProps {
  title: string;
  items: IFilterItem[];
  displayProperty: string;
  queryItem: string;
  queryItemType: string;
  itemToQueryItem: (item: IFilterItem) => Object;
  className?: string;
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
  private dropdownComponent: Dropdown;

  constructor(props: IListFilterDropdownProps) {
    super();

    this.handleDropdownOpen = this.handleDropdownOpen.bind(this);
    this.handleContainerKeyDown = this.handleContainerKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleItemExcludeClick = this.handleItemExcludeClick.bind(this);
    this.handleItemIncludeClick = this.handleItemIncludeClick.bind(this);
    this.handleItemTitleClick = this.handleItemTitleClick.bind(this);

    this.state = {
      items: props.items,
      selectedItemIndex: 0,
      includedItems: [],
      excludedItems: [],
    };
  }

  componentWillReceiveProps(nextProps: IListFilterDropdownProps) {
    this.setState({
      items: this.filterItems(this.props.items, this.state.searchText),
    });
  }

  open() {
    this.dropdownComponent.open();
  }

  close() {
    this.dropdownComponent.close();
  }

  private handleDropdownOpen() {
    this.setState({
      items: this.props.items,
      searchText: '',
      selectedItemIndex: 0,
    });
  }

  private handleContainerKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
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

    text = text.toLowerCase();

    return items.filter(item => item[this.props.displayProperty].toLowerCase().indexOf(text) !== -1);
  }

  private includeItem(item: IFilterItem) {
    let includedItems = [item];
    let excludedItems: IFilterItem[] = [];

    this.props.onChange(this.getExpression(includedItems, excludedItems));

    this.setState({
      includedItems: includedItems,
      excludedItems: excludedItems,
    });
  }

  private toggleItemExclude(item: IFilterItem) {
    let includedItems: IFilterItem[] = [];
    let excludedItems = (this.state.excludedItems.indexOf(item) === -1) ? this.state.excludedItems.concat(item) : this.state.excludedItems.filter(x => x !== item);

    this.props.onChange(this.getExpression(includedItems, excludedItems));

    this.setState({
      includedItems: includedItems,
      excludedItems: excludedItems,
    });
  }

  private toggleItemInclude(item: IFilterItem) {
    let includedItems = (this.state.includedItems.indexOf(item) === -1) ? this.state.includedItems.concat(item) : this.state.includedItems.filter(x => x !== item)
    let excludedItems: IFilterItem[] = [];

    this.props.onChange(this.getExpression(includedItems, excludedItems));

    this.setState({
      includedItems: includedItems,
      excludedItems: excludedItems,
    });
  }

  private getExpression(includedItems: IFilterItem[], excludedItems: IFilterItem[]): NQL.IExpression {
    if (includedItems.length === 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(this.props.queryItem),
        new NQL.ConstantExpression(this.props.itemToQueryItem(includedItems[0]), this.props.queryItemType),
        '==');
    }

    if (includedItems.length > 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(this.props.queryItem),
        new NQL.ListExpression(includedItems.map(item => new NQL.ConstantExpression(this.props.itemToQueryItem(item), this.props.queryItemType))),
        'IN');
    }

    if (excludedItems.length === 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(this.props.queryItem),
        new NQL.ConstantExpression(this.props.itemToQueryItem(excludedItems[0]), this.props.queryItemType),
        '!=');
    }

    if (excludedItems.length > 1) {
      return new NQL.ComparisonExpression(
        new NQL.LocalExpression(this.props.queryItem),
        new NQL.ListExpression(excludedItems.map(item => new NQL.ConstantExpression(this.props.itemToQueryItem(item), this.props.queryItemType))),
        'NOT IN');
    }

    return null;
  }

  render() {
    return (
      <Dropdown className={classNames('list-filter-component', this.props.className, { 'used': this.state.includedItems
      .length > 0 || this.state.excludedItems.length > 0 })} title={this.props.title} onOpen={this.handleDropdownOpen} ref={e => this.dropdownComponent = e}>
        <div className="container" onKeyDown={this.handleContainerKeyDown}>
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
      </Dropdown>
    );
  }
};
