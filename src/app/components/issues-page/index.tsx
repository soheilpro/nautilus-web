import * as _ from 'underscore';
import * as React from 'react';
import { ICommandProvider } from '../../commands';
import { IItem, isIssue, isTask, asIssue } from '../../application';
import { ServiceManager } from '../../services';
import IssueViewConfiguration from '../issue-view-configuration';
import IssueDetail from '../issue-detail';
import TaskDetail from '../task-detail';
import ItemList from '../item-list';
import MasterPage from '../master-page';
import CommandButton from '../command-button';
import Icon from '../icon';
import NewTaskCommand from './new-task-command';
import { IConfiguration, Configuration } from '../issue-view-configuration';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssuesPageProps {
}

interface IIssuesPageState {
  items?: IItem[];
  selectedItem?: IItem;
  configuration?: IConfiguration;
  savedConfigurations?: IConfiguration[];
}

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements ICommandProvider {
  private roamingStorage = ServiceManager.Instance.getRoamingStorage();
  private application = ServiceManager.Instance.getApplication();
  private commandManager = ServiceManager.Instance.getCommandManager();

  constructor() {
    super();

    this.handleApplicationItemsAdd = this.handleApplicationItemsAdd.bind(this);
    this.handleApplicationItemsUpdate = this.handleApplicationItemsUpdate.bind(this);
    this.handleApplicationItemsDelete = this.handleApplicationItemsDelete.bind(this);
    this.handleIssueViewConfigurationChange = this.handleIssueViewConfigurationChange.bind(this);
    this.handleIssueViewConfigurationSavedConfigurationsChange = this.handleIssueViewConfigurationSavedConfigurationsChange.bind(this);
    this.handleItemListItemSelect = this.handleItemListItemSelect.bind(this);
    this.handleResetConfigurationCommandExecute = this.handleResetConfigurationCommandExecute.bind(this);

    this.state = {
      items: [],
      configuration: Configuration.create(),
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
    const items = await this.application.items.getAll(null, null);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
    });

    const savedConfigurations = (await this.roamingStorage.get('issues.configurations', [])).map(x => Configuration.fromJSON(x));

    this.setState({
      savedConfigurations: savedConfigurations,
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

  private handleItemListItemSelect(item: IItem) {
    this.setState({
      selectedItem: item,
    });
  }

  private async handleIssueViewConfigurationChange(configuration: IConfiguration) {
    const items = await this.application.items.getAll(configuration.issueFilterQuery, configuration.taskFilterQuery);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      configuration,
    });
  }

  private async handleIssueViewConfigurationSavedConfigurationsChange(savedConfigurations: IConfiguration[]) {
    this.roamingStorage.set('issues.configurations', savedConfigurations.map(configuration => configuration.toJSON()));

    this.setState({
      savedConfigurations,
    });
  }

  private async handleResetConfigurationCommandExecute() {
    const items = await this.application.items.getAll(null, null);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      configuration: Configuration.create(),
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="issues-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-issue"><Icon name="plus" position="before" /> New Issue</CommandButton>
            <CommandButton commandId="new-task" enabled={isIssue(this.state.selectedItem)}><Icon name="plus" position="before" /> New Task</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <IssueViewConfiguration configuration={this.state.configuration} savedConfigurations={this.state.savedConfigurations} onChange={this.handleIssueViewConfigurationChange} onSavedConfigurationsChange={this.handleIssueViewConfigurationSavedConfigurationsChange} />
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
