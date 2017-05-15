import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IListItem {
  id?: string;
};

interface IListProps {
  items: IListItem[];
  selectedItem?: IListItem;
  renderItem(item: IListItem, index: number): JSX.Element;
  onItemSelect?(item: IListItem): void;
  onItemAction?(item: IListItem): void;
  onItemDelete?(item: IListItem): void;
}

interface IListState {
  selectedItem?: IListItem;
}

export default class List extends React.PureComponent<IListProps, IListState> {
  private componentElement: HTMLElement;
  private selectedItemElement: HTMLElement;

  constructor(props: IListProps) {
    super(props);

    this.handleListKeyDown = this.handleListKeyDown.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);

    this.state = {
      selectedItem: props.selectedItem,
    };
  }

  componentDidMount() {
    $(this.componentElement).on('focusin', (e) => {
      $(this.componentElement).addClass('focused');
    });

    $(this.componentElement).on('focusout', (e) => {
      $(this.componentElement).removeClass('focused');
    });
  }

  componentDidUpdate() {
    if (this.selectedItemElement)
      this.selectedItemElement.focus();
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
      <div className="list-component" onKeyDown={this.handleListKeyDown} ref={e => this.componentElement = e}>
        {
          this.props.items.map((item, index) => {
            return (
              <div className={classNames('item', { selected: this.state.selectedItem === item })} tabIndex={0} onClick={_.partial(this.handleItemClick, item, index)} onDoubleClick={_.partial(this.handleItemDoubleClick, item, index)} key={item.id} ref={e => { if (this.state.selectedItem === item) this.selectedItemElement = e; }}>
                {this.props.renderItem(item, index)}
              </div>
            );
          })
        }
      </div>
    );
  }
};
