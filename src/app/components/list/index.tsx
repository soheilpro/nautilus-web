import _ from 'underscore';
import React from 'react';
import classNames from 'classnames';
import { KeyCode } from '../../keyboard';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IListItem {
  id?: string;
};

interface IListProps {
  items: IListItem[];
  selectedItem?: IListItem;
  autoFocus?: boolean;
  renderItem(item: IListItem, index: number): JSX.Element;
  onItemSelect?(item: IListItem): void;
  onItemAction?(item: IListItem): void;
}

interface IListState {
  isFocused?: boolean;
  selectedItem?: IListItem;
}

export default class List extends React.Component<IListProps, IListState> {
  private componentElement: HTMLElement;

  constructor(props: IListProps) {
    super();

    this.handleListKeyDown = this.handleListKeyDown.bind(this);
    this.handleListFocus = this.handleListFocus.bind(this);
    this.handleListBlur = this.handleListBlur.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);

    this.state = {
      selectedItem: props.selectedItem,
    };
  }

  componentDidMount() {
    if (this.props.autoFocus)
      this.componentElement.focus();
  }

  componentWillReceiveProps(props: IListProps) {
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

  private handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      const selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

      if (selectedItemIndex < this.props.items.length - 1) {
        const selectedItem = this.props.items[selectedItemIndex + 1];

        this.setState({
          selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      const selectedItemIndex = this.props.items.indexOf(this.state.selectedItem);

      if (selectedItemIndex > 0) {
        const selectedItem = this.props.items[selectedItemIndex - 1];

        this.setState({
          selectedItem,
        });

        this.props.onItemSelect(selectedItem);
      }
    }
  }

  private handleListFocus() {
    this.setState({
      isFocused: true,
    });
  }

  private handleListBlur() {
    this.setState({
      isFocused: false,
    });
  }

  private handleItemClick(item: IListItem, index: number) {
    if (this.props.onItemSelect)
      this.props.onItemSelect(item);

    this.setState({
      selectedItem: item,
    });
  }

  private handleItemDoubleClick(item: IListItem, index: number) {
    if (this.props.onItemAction)
      this.props.onItemAction(item);
  }

  render() {
    return (
      <div className={classNames('list-component', { focused: this.state.isFocused })} tabIndex={0} onKeyDown={this.handleListKeyDown} onFocus={this.handleListFocus} onBlur={this.handleListBlur} ref={e => this.componentElement = e}>
        {
          this.props.items.map((item, index) => {
            return (
              <div className={classNames('item', { selected: this.state.selectedItem === item })} onClick={_.partial(this.handleItemClick, item, index)} onDoubleClick={_.partial(this.handleItemDoubleClick, item, index)} key={item.id}>
                {this.props.renderItem(item, index)}
              </div>
            );
          })
        }
      </div>
    );
  }
};
