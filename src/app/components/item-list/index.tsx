import * as _ from 'underscore';
import * as React from 'react';
import * as classNames from 'classnames';
import { IItem } from '../../application';
import { KeyCode } from '../../keyboard';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import Issue from './issue';
import Task from './task';
import EditIssueCommand from './edit-issue-command';
import DeleteIssueCommand from './delete-issue-command';
import EditTaskCommand from './edit-task-command';
import DeleteTaskCommand from './delete-task-command';

require('./index.less');

interface IItemListProps {
  items?: IItem[];
  selectedItem?: IItem;
  autoFocus?: boolean;
  onSelectedItemChange?(item: IItem): void;
}

interface IItemListState {
  isFocused?: boolean;
  selectedItemIndex?: number;
}

export default class ItemList extends React.Component<IItemListProps, IItemListState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueController = ServiceManager.Instance.getIssueController();
  private taskController = ServiceManager.Instance.getTaskController();
  private componentElement: HTMLElement;

  constructor(props: IItemListProps) {
    super();

    this.handleItemListKeyDown = this.handleItemListKeyDown.bind(this);
    this.handleItemListFocus = this.handleItemListFocus.bind(this);
    this.handleItemListBlur = this.handleItemListBlur.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleItemDoubleClick = this.handleItemDoubleClick.bind(this);

    this.state = {
      selectedItemIndex: props.items.indexOf(props.selectedItem),
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
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

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    let selectedItem = this.props.items[this.state.selectedItemIndex];

    return [
      selectedItem && selectedItem.kind === 'issue' ? new EditIssueCommand(selectedItem) : undefined,
      selectedItem && selectedItem.kind === 'issue' ? new DeleteIssueCommand(selectedItem) : undefined,
      selectedItem && selectedItem.kind === 'task' ? new EditTaskCommand(selectedItem) : undefined,
      selectedItem && selectedItem.kind === 'task' ? new DeleteTaskCommand(selectedItem) : undefined,
    ];
  }

  private handleItemListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.which === KeyCode.DownArrow) {
      event.preventDefault();

      if (this.state.selectedItemIndex < this.props.items.length - 1) {
        let selectedItemIndex = this.state.selectedItemIndex + 1;

        this.setState({
          selectedItemIndex: selectedItemIndex,
        });

        this.props.onSelectedItemChange(this.props.items[selectedItemIndex]);
      }
    }
    else if (event.which === KeyCode.UpArrow) {
      event.preventDefault();

      if (this.state.selectedItemIndex > 0) {
        let selectedItemIndex = this.state.selectedItemIndex - 1;

        this.setState({
          selectedItemIndex: selectedItemIndex,
        });

        this.props.onSelectedItemChange(this.props.items[selectedItemIndex]);
      }
    }
  }

  private handleItemListFocus() {
    this.setState({
      isFocused: true,
    });
  }

  private handleItemListBlur() {
    this.setState({
      isFocused: false,
    });
  }

  private handleItemClick(item: IItem, index: number) {
    if (this.props.onSelectedItemChange)
      this.props.onSelectedItemChange(item);

    this.setState({
      selectedItemIndex: index,
    });
  }

  private handleItemDoubleClick(item: IItem, index: number) {
    if (item.kind === 'issue')
      return this.issueController.editIssue(item);

    if (item.kind === 'task')
      return this.taskController.editTask(item);

    throw new Error('Not supported.');
  }

  renderItem(item: IItem) {
    if (item.kind === 'issue')
      return <Issue issue={item} />;

    if (item.kind === 'task')
      return <Task task={item} />;

    throw new Error('Not supported.');
  }

  render() {
    return (
      <div className={classNames('item-list component', { focused: this.state.isFocused })} tabIndex={0} onKeyDown={this.handleItemListKeyDown} onFocus={this.handleItemListFocus} onBlur={this.handleItemListBlur} ref={e => this.componentElement = e}>
        {
          this.props.items.map((item, index) => {
            return (
              <div className={classNames('item', { selected: this.state.selectedItemIndex === index })} onClick={_.partial(this.handleItemClick, item, index)} onDoubleClick={_.partial(this.handleItemDoubleClick, item, index)} key={item.id}>
                {this.renderItem(item)}
              </div>
            );
          })
        }
      </div>
    );
  }
};
