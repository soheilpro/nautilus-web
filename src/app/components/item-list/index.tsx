import * as _ from 'underscore';
import * as React from 'react';
import { IItem, IIssue, ITask, isIssue, isTask } from '../../application';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import List from '../list';
import Issue from './issue';
import Task from './task';
import EditIssueCommand from './edit-issue-command';
import DeleteIssueCommand from './delete-issue-command';
import EditTaskCommand from './edit-task-command';
import DeleteTaskCommand from './delete-task-command';

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

export default class ItemList extends React.Component<IItemListProps, IItemListState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
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

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(nextProps: IItemListProps) {
    this.setState({
      items: this.sortItems(nextProps.items),
      selectedItem: nextProps.selectedItem,
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    let selectedItem = this.state.selectedItem;

    return [
      isIssue(selectedItem) ? new EditIssueCommand(selectedItem) : undefined,
      isIssue(selectedItem) ? new DeleteIssueCommand(selectedItem) : undefined,
      isTask(selectedItem) ? new EditTaskCommand(selectedItem) : undefined,
      isTask(selectedItem) ? new DeleteTaskCommand(selectedItem) : undefined,
    ];
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
    items = items.slice();

    items.sort((x: IItem, y: IItem) => {
      let xNodes = [] as IItem[];

      if (x.parent)
        xNodes.push(_.find(items, item => item.id === x.parent.id));

      xNodes.reverse();
      xNodes.push(x);

      let yNodes = [] as IItem[];

      if (y.parent)
        yNodes.push(_.find(items, item => item.id === y.parent.id));

      yNodes.reverse();
      yNodes.push(y);

      for (let i = 0; ; i++) {
        let xNode = xNodes[i];
        let yNode = yNodes[i];

        if (!xNode && !yNode)
          return 0;

        if (!xNode)
          return -1;

        if (!yNode)
          return 1;

        let result = -1 * xNode.sid.localeCompare(yNode.sid);

        if (result !== 0)
          return result;
      }
    });

    return items;
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
