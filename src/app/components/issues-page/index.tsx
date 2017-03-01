import * as _ from 'underscore';
import * as React from 'react';
import * as uuid from 'uuid';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { IItem, isIssue, isTask, asIssue } from '../../application';
import { ServiceManager } from '../../services';
import IssueViewConfiguration from '../issue-view-configuration';
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

interface IConfiguration {
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
}

interface ISavedConfiguration {
  id: string;
  name: string;
  configuration: IConfiguration;
}

interface IIssuesPageProps {
}

interface IIssuesPageState {
  items?: IItem[];
  selectedItem?: IItem;
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
  savedConfigurations?: ISavedConfiguration[];
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
    this.handleIssueViewConfigurationChange = this.handleIssueViewConfigurationChange.bind(this);
    this.handleIssueViewConfigurationSaveConfiguration = this.handleIssueViewConfigurationSaveConfiguration.bind(this);
    this.handleIssueViewConfigurationDeleteSavedConfiguration = this.handleIssueViewConfigurationDeleteSavedConfiguration.bind(this);
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

  private handleItemListItemSelect(item: IItem) {
    this.setState({
      selectedItem: item,
    });
  }

  private async handleIssueViewConfigurationChange(configuration: IConfiguration) {
    let items = await this.application.items.getAll(configuration.issueFilterQuery, configuration.taskFilterQuery);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      issueFilterQuery: configuration.issueFilterQuery,
      taskFilterQuery: configuration.taskFilterQuery,
    });
  }

  private async handleIssueViewConfigurationSaveConfiguration(configuration: IConfiguration, name: string) {
    this.setState({
      savedConfigurations: this.state.savedConfigurations.concat({
        id: uuid(),
        name: name,
        configuration: configuration,
      }),
    });
  }

  private async handleIssueViewConfigurationDeleteSavedConfiguration(savedConfiguration: ISavedConfiguration) {
    this.setState({
      savedConfigurations: this.state.savedConfigurations.filter(x => x !== savedConfiguration),
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

  private getCurrentConfiguration(): IConfiguration {
    return {
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: this.state.taskFilterQuery,
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
          <div className="view-settings row">
            <IssueViewConfiguration currentConfiguration={this.getCurrentConfiguration()} savedConfigurations={this.state.savedConfigurations} onChange={this.handleIssueViewConfigurationChange} onSaveConfiguration={this.handleIssueViewConfigurationSaveConfiguration} onDeleteSavedConfiguration={this.handleIssueViewConfigurationDeleteSavedConfiguration} />
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
