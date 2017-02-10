import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { KeyCode } from '../../keyboard';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemListProps {
  items: any[];
  selectedItem?: any;
  autoFocus?: boolean;
  renderItem(item: any, index: number): JSX.Element;
  onItemSelect?(item: any): void;
  onItemAction?(item: any): void;
}

interface IItemListState {
  isFocused?: boolean;
  selectedItemIndex?: number;
}

export default class ItemList extends React.Component<IItemListProps, IItemListState> {
  private componentElement: HTMLElement;

  constructor(props: IItemListProps) {
    super();

    this.handleListKeyDown = this.handleListKeyDown.bind(this);
    this.handleListFocus = this.handleListFocus.bind(this);
    this.handleListBlur = this.handleListBlur.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);

    this.state = {
      selectedItemIndex: props.items.indexOf(props.selectedItem),
    };
  }

  componentDidMount() {
    if (this.props.autoFocus)
      this.componentElement.focus();
  }

  componentWillReceiveProps(nextProps: IItemListProps) {
    this.setState({
      selectedItemIndex: nextProps.items.indexOf(nextProps.selectedItem),
    });
  }

  private handleListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedItemIndex < this.props.items.length - 1) {
        let selectedItemIndex = this.state.selectedItemIndex + 1;

        this.setState({
          selectedItemIndex: selectedItemIndex,
        });

        this.props.onItemSelect(this.props.items[selectedItemIndex]);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedItemIndex > 0) {
        let selectedItemIndex = this.state.selectedItemIndex - 1;

        this.setState({
          selectedItemIndex: selectedItemIndex,
        });

        this.props.onItemSelect(this.props.items[selectedItemIndex]);
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

  private handleItemClick(item: any, index: number) {
    if (this.props.onItemSelect)
      this.props.onItemSelect(item);

    this.setState({
      selectedItemIndex: index,
    });
  }

  private handleItemDoubleClick(item: any, index: number) {
    if (this.props.onItemAction)
      this.props.onItemAction(item);
  }

  render() {
    return (
      <div className={classNames('list-component', { focused: this.state.isFocused })} tabIndex={0} onKeyDown={this.handleListKeyDown} onFocus={this.handleListFocus} onBlur={this.handleListBlur} ref={e => this.componentElement = e}>
        {
          this.props.items.map((item, index) => {
            return (
              <div className={classNames('item', { selected: this.state.selectedItemIndex === index })} onClick={_.partial(this.handleItemClick, item, index)} onDoubleClick={_.partial(this.handleItemDoubleClick, item, index)} key={item.id}>
                {this.props.renderItem(item, index)}
              </div>
            );
          })
        }
      </div>
    );
  }
};
