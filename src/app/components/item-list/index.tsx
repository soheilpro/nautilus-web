import * as _ from 'underscore';
import * as React from 'react';
import { IItem, isIssue, isTask } from '../../application';
import { ServiceManager } from '../../services';
import List from '../list';
import Issue from './issue';
import Task from './task';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IItemListProps {
  items?: IItem[];
  selectedItem?: IItem;
  autoFocus?: boolean;
  onItemSelect?(item: IItem): void;
}

interface IItemListState {
  items?: IItem[];
  selectedItem?: IItem;
}

export default class ItemList extends React.Component<IItemListProps, IItemListState> {
  private issueController = ServiceManager.Instance.getIssueController();
  private taskController = ServiceManager.Instance.getTaskController();

  constructor(props: IItemListProps) {
    super();

    this.handleItemSelect = this.handleItemSelect.bind(this);
    this.handleItemAction = this.handleItemAction.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.state = {
      items: this.sortItems(props.items),
      selectedItem: props.selectedItem,
    };
  }

  componentWillReceiveProps(props: IItemListProps) {
    this.setState({
      items: this.sortItems(props.items),
      selectedItem: props.selectedItem,
    });
  }

  private handleItemSelect(item: IItem) {
    if (this.props.onItemSelect)
      this.props.onItemSelect(item);

    this.setState({
      selectedItem: item,
    });
  }

  private handleItemAction(item: IItem) {
    if (isIssue(item))
      return this.issueController.editIssue(item);

    if (isTask(item))
      return this.taskController.editTask(item);

    throw new Error('Not supported.');
  }

  private sortItems(items: IItem[]) {
    const findItemById = _.memoize((id: string) => {
      return _.find(items, item => item.id === id);
    });

    const getParents = (item: IItem): IItem[] => {
      if (!item.parent)
        return [];

      const parent = findItemById(item.parent.id);

      return getParents(parent).concat(parent);
    };

    const itemsWithPath = items.map(item => {
      return {
        item,
        path: getParents(item).concat(item).map(item => item.sid),
      };
    });

    itemsWithPath.sort((x, y) => {
      for (let i = 0; ; i++) {
        const xNode = x.path[i];
        const yNode = y.path[i];

        if (!xNode && !yNode)
          return 0;

        if (!xNode)
          return -1;

        if (!yNode)
          return 1;

        const result = -1 * xNode.localeCompare(yNode);

        if (result !== 0)
          return result;
      }
    });

    return itemsWithPath.map(itemWithPath => itemWithPath.item);
  }

  renderItem(item: IItem) {
    if (isIssue(item))
      return <Issue issue={item} />;

    if (isTask(item))
      return <Task task={item} />;

    throw new Error('Not supported.');
  }

  render() {
    return (
      <div className="item-list-component">
        <List items={this.state.items} selectedItem={this.state.selectedItem} autoFocus={this.props.autoFocus} renderItem={this.renderItem} onItemSelect={this.handleItemSelect} onItemAction={this.handleItemAction} />
      </div>
    );
  }
};
