import * as _ from 'underscore';
import * as React from 'react';
import { ICommandProvider } from '../../commands';
import { IItem, IIssue, ITask, asIssue, isIssue, isTask } from '../../application';
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
  selectedItem?: IItem;
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
    this.handleItemListItemSelect = this.handleItemListItemSelect.bind(this);

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
      selectedItem: _.last(issues),
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
      new NewTaskCommand(asIssue(this.state.selectedItem)),
    ];
  }

  private async handleApplicationIssuesAdd({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
      selectedItem: issue,
    });
  }

  private async handleApplicationIssuesUpdate({ issue }: { issue: IIssue }) {
    this.setState({
      issues: await this.application.issues.getAll(),
      selectedItem: issue,
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
      selectedItem: issues[issueIndex],
    });
  }

  private async handleApplicationTasksAdd({ task }: { task: ITask }) {
    this.setState({
      tasks: await this.application.tasks.getAll(),
      selectedItem: task,
    });
  }

  private async handleApplicationTasksUpdate({ task }: { task: ITask }) {
    this.setState({
      tasks: await this.application.tasks.getAll(),
      selectedItem: task,
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
      selectedItem: tasks[taskIndex],
    });
  }

  private handleNewIssueButtonClick() {
    this.issueController.addIssue();
  }

  private handleNewTaskButtonClick() {
    this.taskController.addTask(asIssue(this.state.selectedItem));
  }

  private handleRefreshButtonClick() {
  }

  private handleItemListItemSelect(item: IIssue) {
    this.setState({
      selectedItem: item,
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="issues-page component">
          <div className="action-bar">
            <Button onClick={this.handleNewIssueButtonClick}><Icon name="plus" position="before" /> New Issue</Button>
            <Button onClick={this.handleNewTaskButtonClick} enabled={isIssue(this.state.selectedItem)}><Icon name="plus" position="before" /> New Task</Button>
            <Button type="secondary" onClick={this.handleRefreshButtonClick}><Icon name="refresh" /></Button>
          </div>
          <div className="row container">
            <div className="list">
              <ItemList issues={this.state.issues} tasks={this.state.tasks} selectedItem={this.state.selectedItem} autoFocus={true} onItemSelect={this.handleItemListItemSelect} />
            </div>
            <div className="detail">
              {
                isIssue(this.state.selectedItem) ?
                  <IssueDetail issue={this.state.selectedItem} />
                  : null
              }
              {
                isTask(this.state.selectedItem) ?
                  <TaskDetail task={this.state.selectedItem} />
                  : null
              }
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
