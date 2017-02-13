import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Dropdown from '../dropdown';
import Input from '../input';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./inclusion-filter-dropdown.less');

interface IFilterItem {
  id?: string;
  [key: string]: any;
};

interface IInclusionFilterDropdownProps {
  title: string;
  items: IFilterItem[];
  displayProperty: string;
}

interface IInclusionFilterDropdownState {
  items?: IFilterItem[];
  selectedItemIndex?: number;
  searchText?: string;
  includedItems?: IFilterItem[];
  excludedItems?: IFilterItem[];
}

export default class InclusionFilterDropdown extends React.Component<IInclusionFilterDropdownProps, IInclusionFilterDropdownState> {
  constructor(props: IInclusionFilterDropdownProps) {
    super();

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

  componentWillReceiveProps(nextProps: IInclusionFilterDropdownProps) {
    this.setState({
      items: this.filterItems(this.props.items, this.state.searchText),
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
    this.setState({
      excludedItems: [],
      includedItems: [item],
    });
  }

  private toggleItemExclude(item: IFilterItem) {
    if (this.state.excludedItems.indexOf(item) === -1) {
      this.setState({
        excludedItems: this.state.excludedItems.concat(item),
        includedItems: [],
      });
    }
    else {
      this.setState({
        excludedItems: this.state.excludedItems.filter(x => x !== item),
        includedItems: [],
      });
    }
  }

  private toggleItemInclude(item: IFilterItem) {
    if (this.state.includedItems.indexOf(item) === -1) {
      this.setState({
        excludedItems: [],
        includedItems: this.state.includedItems.concat(item),
      });
    }
    else {
      this.setState({
        excludedItems: [],
        includedItems: this.state.includedItems.filter(x => x !== item),
      });
    }
  }

  render() {
    return (
      <Dropdown className="inclusion-filter-dropdown-component" title={this.props.title}>
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
