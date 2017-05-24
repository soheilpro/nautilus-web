import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';
import { IItem } from './iitem';
import TableHeader from './table-header';
import TableRow from './table-row';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface ITableProps {
  items: IItem[];
  selectedItem?: IItem;
  Header?: typeof TableHeader;
  Row?: typeof TableRow;
  className?: string;
  onItemSelect?(item: IItem): void;
  onItemAction?(item: IItem): void;
  onItemDelete?(item: IItem): void;
}

interface ITableState {
  selectedItem?: IItem;
}

export default class Table extends React.PureComponent<ITableProps, ITableState> {
  private componentElement: HTMLElement;
  private selectedItemElement: HTMLElement;

  constructor(props: ITableProps) {
    super(props);

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleItemAction = this.handleItemAction.bind(this);

    this.state = {
      selectedItem: props.selectedItem,
    };
  }

  componentDidUpdate() {
    if ($(this.componentElement).hasClass('focus') && this.selectedItemElement)
      this.selectedItemElement.focus();
  }

  componentWillReceiveProps(props: ITableProps) {
    let selectedItem = props.selectedItem;

    if (!selectedItem) {
      // Handle deleted item
      if (props.items.indexOf(this.state.selectedItem) === -1) {
        let selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

        if (selectedItemIndex > props.items.length - 1)
          selectedItemIndex = props.items.length - 1;
        else if (selectedItemIndex < 0)
          selectedItemIndex = 0;

        selectedItem = props.items[selectedItemIndex];

        if (selectedItem)
          if (props.onItemSelect)
            props.onItemSelect(selectedItem);
      }
    }

    this.setState({
      selectedItem,
    });
  }

  private handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      const selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

      if (selectedItemIndex < this.props.items.length - 1) {
        event.preventDefault();

        const selectedItem = this.props.items[selectedItemIndex + 1];

        this.setState({
          selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      const selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

      if (selectedItemIndex > 0) {
        event.preventDefault();

        const selectedItem = this.props.items[selectedItemIndex - 1];

        this.setState({
          selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.Enter) {
      event.preventDefault();

      if (this.props.onItemAction)
        this.props.onItemAction(this.state.selectedItem);
    }
    else if (event.which === KeyCode.Delete) {
      event.preventDefault();

      if (this.props.onItemDelete)
        this.props.onItemDelete(this.state.selectedItem);
    }
  }

  private handleFocus() {
    $(this.componentElement).addClass('focus');
  }

  private handleBlur() {
    $(this.componentElement).removeClass('focus');
  }

  private handleItemSelect(item: IItem) {
    if (this.props.onItemSelect)
      this.props.onItemSelect(item);

    this.setState({
      selectedItem: item,
    });
  }

  private handleItemAction(item: IItem) {
    if (this.props.onItemAction)
      this.props.onItemAction(item);
  }

  render() {
    return (
      <div className={classNames('table-component', this.props.className)} onKeyDown={this.handleKeyDown} onFocus={this.handleFocus} onBlur={this.handleBlur} ref={e => this.componentElement = e}>
        {
          this.props.Header &&
            <this.props.Header />
        }
        {
          this.props.items.map((item, index) => {
            return (
              <this.props.Row item={item} index={index} isSelected={this.state.selectedItem === item} onSelect={_.partial(this.handleItemSelect, item)} onAction={_.partial(this.handleItemAction, item)} key={item.id} />
            );
          })
        }
      </div>
    );
  }
};
