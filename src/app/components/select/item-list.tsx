import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import Input from '../input';
import { IItem } from './iitem';

require('../../assets/stylesheets/base.less');
require('./item-list.less');

interface IItemListProps {
  items: IItem[];
  displayProperty: string;
  onSelect(item: IItem): void;
}

interface IItemListState {
  items?: IItem[];
  selectedItemIndex?: number;
  searchText?: string;
}

export default class ItemList extends React.PureComponent<IItemListProps, IItemListState> {
  constructor(props: IItemListProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleItemListMouseLeave = this.handleItemListMouseLeave.bind(this);
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this);
    this.handleItemTitleClick = this.handleItemTitleClick.bind(this);

    this.state = {
      items: props.items,
      selectedItemIndex: -1,
    };
  }

  componentWillReceiveProps(props: IItemListProps) {
    this.setState({
      items: props.items,
    });
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          selectedItemIndex: state.selectedItemIndex < state.items.length - 1 ? state.selectedItemIndex + 1 : 0,
        };
      });
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      this.setState(state => {
        return {
          selectedItemIndex: state.selectedItemIndex > 0 ? state.selectedItemIndex - 1 : state.items.length - 1,
        };
      });
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.state.selectedItemIndex !== -1) {
        const selectedItem = this.state.items[this.state.selectedItemIndex];
        this.props.onSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.Escape) {
      event.preventDefault();
    }
  }

  private handleSearchTextChange(value: string) {
    this.setState({
      searchText: value,
      items: this.filterItems(this.props.items, value),
      selectedItemIndex: 0,
    });
  }

  private handleItemListMouseLeave() {
    this.setState({
      selectedItemIndex: -1,
    });
  }

  private handleItemMouseEnter(item: IItem) {
    this.setState(state => {
      return {
        selectedItemIndex: state.items.indexOf(item),
      };
    });
  }

  private handleItemTitleClick(item: IItem, event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    this.props.onSelect(item);
  }

  private filterItems(items: IItem[], text: string) {
    if (!text)
      return items;

    text = text.toLowerCase().trim();

    return items.filter(item => item[this.props.displayProperty].toLowerCase().indexOf(text) !== -1);
  }

  render() {
    return (
      <div className="item-list-component" onKeyDown={this.handleKeyDown}>
        <Input className="search-input" value={this.state.searchText} autoFocus={true} selectOnFocus={true} style="simple" onChange={this.handleSearchTextChange} />
        <div className="item-list" onMouseLeave={this.handleItemListMouseLeave}>
          {
            this.state.items.map((item, index) => {
              return (
                <div className={classNames('item', 'row', {'selected': index === this.state.selectedItemIndex})} onMouseEnter={_.partial(this.handleItemMouseEnter, item)} key={item.id}>
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
