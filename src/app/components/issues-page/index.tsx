import * as _ from 'underscore';
import * as React from 'react';
import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { IItem, isIssue, isTask, asIssue } from '../../application';
import { ServiceManager } from '../../services';
import IssueFilterSet from '../issue-filter-set';
import TaskFilterSet from '../task-filter-set';
import ConfigurationManager from '../configuration-manager';
import IssueDetail from '../issue-detail';
import TaskDetail from '../task-detail';
import ItemList from '../item-list';
import MasterPage from '../master-page';
import Button from '../button';
import Icon from '../icon';
import NewTaskCommand from './new-task-command';
import ClearFiltersCommand from './clear-filters-command';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IViewConfiguration {
  issues: {
    filterQuery?: NQL.Expression;
  };
  tasks: {
    filterQuery?: NQL.Expression;
  };
}

interface ISavedViewConfiguration {
  id: string;
  name: string;
  configuration: IViewConfiguration;
}

interface IIssuesPageProps {
}

interface IIssuesPageState {
  items?: IItem[];
  selectedItem?: IItem;
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
  savedConfigurations?: ISavedViewConfiguration[];
}

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements ICommandProvider {
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();
  private issueController = ServiceManager.Instance.getIssueController();
  private taskController = ServiceManager.Instance.getTaskController();

  constructor() {
    super();

    this.handleApplicationItemsAdd = this.handleApplicationItemsAdd.bind(this);
    this.handleApplicationItemsUpdate = this.handleApplicationItemsUpdate.bind(this);
    this.handleApplicationItemsDelete = this.handleApplicationItemsDelete.bind(this);
    this.handleNewIssueButtonClick = this.handleNewIssueButtonClick.bind(this);
    this.handleNewTaskButtonClick = this.handleNewTaskButtonClick.bind(this);
    this.handleRefreshButtonClick = this.handleRefreshButtonClick.bind(this);
    this.handleIssueFilterSetChange = this.handleIssueFilterSetChange.bind(this);
    this.handleTaskFilterSetChange = this.handleTaskFilterSetChange.bind(this);
    this.handleConfigurationManagerReset = this.handleConfigurationManagerReset.bind(this);
    this.handleConfigurationManagerSave = this.handleConfigurationManagerSave.bind(this);
    this.handleConfigurationManagerDelete = this.handleConfigurationManagerDelete.bind(this);
    this.handleConfigurationManagerSelect = this.handleConfigurationManagerSelect.bind(this);
    this.handleItemListItemSelect = this.handleItemListItemSelect.bind(this);
    this.handleClearFiltersCommandExecute = this.handleClearFiltersCommandExecute.bind(this);

    this.state = {
      items: [],
      savedConfigurations: [],
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
    this.application.items.on('add', this.handleApplicationItemsAdd);
    this.application.items.on('update', this.handleApplicationItemsUpdate);
    this.application.items.on('delete', this.handleApplicationItemsDelete);
  }

  async componentDidMount() {
    let items = await this.application.items.getAll(null, null);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
    });
  }

  componentWillUnmount() {
    this.application.items.off('delete', this.handleApplicationItemsDelete);
    this.application.items.off('update', this.handleApplicationItemsUpdate);
    this.application.items.off('add', this.handleApplicationItemsAdd);
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    return [
      new NewTaskCommand(asIssue(this.state.selectedItem)),
      new ClearFiltersCommand(this.handleClearFiltersCommandExecute),
    ];
  }

  private async handleApplicationItemsAdd({ item }: { item: IItem }) {
    this.setState({
      items: await this.application.items.getAll(null, null),
      selectedItem: item,
    });
  }

  private async handleApplicationItemsUpdate({ item }: { item: IItem }) {
    this.setState({
      items: await this.application.items.getAll(null, null),
      selectedItem: item,
    });
  }

  private async handleApplicationItemsDelete({ item }: { item: IItem }) {
    this.setState({
      items: await this.application.items.getAll(null, null),
      selectedItem: undefined,
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

  private async handleIssueFilterSetChange(query: NQL.Expression) {
    let items = await this.application.items.getAll(query, this.state.taskFilterQuery);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      issueFilterQuery: query,
    });
  }

  private async handleTaskFilterSetChange(query: NQL.Expression) {
    let items = await this.application.items.getAll(this.state.issueFilterQuery, query);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      taskFilterQuery: query,
    });
  }

  private handleItemListItemSelect(item: IItem) {
    this.setState({
      selectedItem: item,
    });
  }

  private async handleConfigurationManagerReset() {
    let items = await this.application.items.getAll(null, null);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      issueFilterQuery: null,
      taskFilterQuery: null,
    });
  }

  private async handleConfigurationManagerSave(configuration: IViewConfiguration, name: string) {
    this.setState({
      savedConfigurations: this.state.savedConfigurations.concat({
        id: uuid(),
        name: name,
        configuration: configuration,
      }),
    });
  }

  private async handleConfigurationManagerDelete(savedConfiguration: ISavedViewConfiguration) {
    this.setState({
      savedConfigurations: this.state.savedConfigurations.filter(x => x !== savedConfiguration),
    });
  }

  private async handleConfigurationManagerSelect(savedConfiguration: ISavedViewConfiguration) {
    let items = await this.application.items.getAll(savedConfiguration.configuration.issues.filterQuery, savedConfiguration.configuration.tasks.filterQuery);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      issueFilterQuery: savedConfiguration.configuration.issues.filterQuery,
      taskFilterQuery: savedConfiguration.configuration.tasks.filterQuery,
    });
  }

  private async handleClearFiltersCommandExecute() {
    let items = await this.application.items.getAll(null, null);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      issueFilterQuery: null,
      taskFilterQuery: null,
    });
  }

  private getCurrentConfiguration(): IViewConfiguration {
    if (!this.state.issueFilterQuery && !this.state.taskFilterQuery)
      return null;

    return {
      issues: {
        filterQuery: this.state.issueFilterQuery,
      },
      tasks: {
        filterQuery: this.state.taskFilterQuery,
      },
    };
  }

  render() {
    return (
      <MasterPage>
        <div className="issues-page-component">
          <div className="action-bar">
            <Button onClick={this.handleNewIssueButtonClick}><Icon name="plus" position="before" /> New Issue</Button>
            <Button onClick={this.handleNewTaskButtonClick} enabled={isIssue(this.state.selectedItem)}><Icon name="plus" position="before" /> New Task</Button>
            <Button type="secondary" onClick={this.handleRefreshButtonClick}><Icon name="refresh" /></Button>
          </div>
          <div className="view row">
            <div className="configuration-manager">
              <ConfigurationManager currentConfiguration={this.getCurrentConfiguration()} savedConfigurations={this.state.savedConfigurations} onReset={this.handleConfigurationManagerReset} onSave={this.handleConfigurationManagerSave} onDelete={this.handleConfigurationManagerDelete} onSelect={this.handleConfigurationManagerSelect} />
            </div>
            <div className="filters table">
              <div className="filter-set table-row">
                <div className="title table-cell">
                  Filter Issues:
                </div>
                <div className="table-cell">
                  <IssueFilterSet query={this.state.issueFilterQuery} onChange={this.handleIssueFilterSetChange} />
                </div>
              </div>
              <div className="separator"></div>
              <div className="filter-set table-row">
                <div className="title table-cell">
                  Filter Tasks:
                </div>
                <div className="table-cell">
                  <TaskFilterSet query={this.state.taskFilterQuery} onChange={this.handleTaskFilterSetChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="items row">
            <div className="item-list">
              <ItemList items={this.state.items} selectedItem={this.state.selectedItem} autoFocus={true} onItemSelect={this.handleItemListItemSelect} />
            </div>
            <div className="item-detail">
              {
                isIssue(this.state.selectedItem) &&
                  <IssueDetail issue={this.state.selectedItem} />
              }
              {
                isTask(this.state.selectedItem) &&
                  <TaskDetail task={this.state.selectedItem} />
              }
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
