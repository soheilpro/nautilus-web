import * as _ from 'underscore';
import * as React from 'react';
import { ICommandProvider } from '../../commands';
import { IItem, IIssue, ITask } from '../../application';
import { ServiceManager } from '../../services';
import IssueDetail from '../issue-detail';
import TaskDetail from '../task-detail';
import ItemList from '../item-list';
import MasterPage from '../master-page';
import Button from '../button';
import Icon from '../icon';
import NewTaskCommand from './new-task-command';

require('./index.less');

interface IIssuesPageProps {
}

interface IIssuesPageState {
  issues?: IIssue[];
  tasks?: ITask[];
  selectedIssue?: IIssue;
  selectedTask?: ITask;
}

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueController = ServiceManager.Instance.getIssueController();
  private taskController = ServiceManager.Instance.getTaskController();

  constructor() {
    super();

    this.handleApplicationIssuesAdd = this.handleApplicationIssuesAdd.bind(this);
    this.handleApplicationIssuesUpdate = this.handleApplicationIssuesUpdate.bind(this);
    this.handleApplicationIssuesDelete = this.handleApplicationIssuesDelete.bind(this);
    this.handleApplicationTasksAdd = this.handleApplicationTasksAdd.bind(this);
    this.handleApplicationTasksUpdate = this.handleApplicationTasksUpdate.bind(this);
    this.handleApplicationTasksDelete = this.handleApplicationTasksDelete.bind(this);
    this.handleNewIssueButtonClick = this.handleNewIssueButtonClick.bind(this);
    this.handleNewTaskButtonClick = this.handleNewTaskButtonClick.bind(this);
    this.handleRefreshButtonClick = this.handleRefreshButtonClick.bind(this);
    this.handleItemListSelectedItemChange = this.handleItemListSelectedItemChange.bind(this);

    this.state = {
      issues: [],
      tasks: [],
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.application.issues.on('add', this.handleApplicationIssuesAdd);
    this.application.issues.on('update', this.handleApplicationIssuesUpdate);
    this.application.issues.on('delete', this.handleApplicationIssuesDelete);
    this.application.tasks.on('add', this.handleApplicationTasksAdd);
    this.application.tasks.on('update', this.handleApplicationTasksUpdate);
    this.application.tasks.on('delete', this.handleApplicationTasksDelete);
  }

  async componentDidMount() {
    let issues = await this.application.issues.getAll();
    let tasks = await this.application.tasks.getAllForIssues(issues);

    this.setState({
      issues: issues,
      tasks: tasks,
      selectedIssue: _.last(issues),
      selectedTask: null,
    });
  }

  componentWillUnmount() {
    this.application.tasks.off('delete', this.handleApplicationTasksDelete);
    this.application.tasks.off('update', this.handleApplicationTasksUpdate);
    this.application.tasks.off('add', this.handleApplicationTasksAdd);
    this.application.issues.off('delete', this.handleApplicationIssuesDelete);
    this.application.issues.off('update', this.handleApplicationIssuesUpdate);
    this.application.issues.off('add', this.handleApplicationIssuesAdd);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new NewTaskCommand(this.state.selectedIssue),
    ];
  }

  private async handleApplicationIssuesAdd({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
      selectedIssue: issue,
      selectedTask: null,
    });
  }

  private async handleApplicationIssuesUpdate({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
      selectedIssue: issue,
      selectedTask: null,
    });
  }

  private async handleApplicationIssuesDelete({ issue }: { issue: IIssue }) {
    let issues = await this.application.issues.getAll();
    let issueIndex = this.state.issues.indexOf(issue);

    if (issueIndex > issues.length - 1)
      issueIndex = issues.length - 1;
    else if (issueIndex < 0)
      issueIndex = 0;

    this.setState({
      issues: issues,
      selectedIssue: issues[issueIndex],
      selectedTask: null,
    });
  }

  private async handleApplicationTasksAdd({ task }: { task: ITask }) {
    this.setState({
      tasks: await this.application.tasks.getAll(),
      selectedTask: task,
      selectedIssue: null,
    });
  }

  private async handleApplicationTasksUpdate({ task }: { task: ITask }) {
    this.setState({
      tasks: await this.application.tasks.getAll(),
      selectedTask: task,
      selectedIssue: null,
    });
  }

  private async handleApplicationTasksDelete({ task }: { task: ITask }) {
    let tasks = await this.application.tasks.getAll();
    let taskIndex = this.state.tasks.indexOf(task);

    if (taskIndex > tasks.length - 1)
      taskIndex = tasks.length - 1;
    else if (taskIndex < 0)
      taskIndex = 0;

    this.setState({
      tasks: tasks,
      selectedTask: tasks[taskIndex],
      selectedIssue: null,
    });
  }

  private handleNewIssueButtonClick() {
    this.issueController.addIssue();
  }

  private handleNewTaskButtonClick() {
    this.taskController.addTask(this.state.selectedIssue);
  }

  private handleRefreshButtonClick() {
  }

  private handleItemListSelectedItemChange(item: IIssue) {
    this.setState({
      selectedIssue: item.kind === 'issue' ? item : null,
      selectedTask: item.kind === 'task' ? item : null,
    });
  }

  private getSortedItems() {
    let items = this.state.issues.concat(this.state.tasks);

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

        let result = xNode.sid.localeCompare(yNode.sid) * -1;

        if (result !== 0)
          return result;
      }
    });

    return items;
  }

  render() {
    let items = this.getSortedItems();

    return (
      <MasterPage>
        <div className="issues-page component">
          <div className="action-bar">
            <Button onClick={this.handleNewIssueButtonClick}><Icon name="plus" position="before" /> New Issue</Button>
            <Button onClick={this.handleNewTaskButtonClick} enabled={!!this.state.selectedIssue}><Icon name="plus" position="before" /> New Task</Button>
            <Button type="secondary" onClick={this.handleRefreshButtonClick}><Icon name="refresh" /></Button>
          </div>
          <div className="row container">
            <div className="list">
              <ItemList items={items} selectedItem={this.state.selectedIssue || this.state.selectedTask} autoFocus={true} onSelectedItemChange={this.handleItemListSelectedItemChange} />
            </div>
            <div className="detail">
              {
                this.state.selectedIssue ?
                  <IssueDetail issue={this.state.selectedIssue} />
                  : null
              }
              {
                this.state.selectedTask ?
                  <TaskDetail task={this.state.selectedTask} />
                  : null
              }
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
