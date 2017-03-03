import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import Button from '../button';
import Dropdown from '../dropdown';
import PromptWindow from '../prompt-window';
import IssueQueryBuilder from '../issue-query-builder';
import TaskQueryBuilder from '../task-query-builder';
import ConfigurationList from './configuration-list';
import { IConfiguration } from './iconfiguration';
import { Configuration } from './configuration';
import IssueProjectFilterCommand from './issue-project-filter-command';
import IssueTypeFilterCommand from './issue-type-filter-command';
import TaskTypeFilterCommand from './task-type-filter-command';
import ResetConfigurationCommand from './reset-configuration-command';
import SaveConfigurationCommand from './save-configuration-command';
import LoadConfigurationCommand from './load-configuration-command';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueViewConfigurationProps {
  configuration?: IConfiguration;
  savedConfigurations?: IConfiguration[];
  onChange(configuration: IConfiguration): void;
  onSavedConfigurationsChange(savedConfigurations: IConfiguration[]): void;
}

interface IIssueViewConfigurationState {
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
  savedConfigurations?: IConfiguration[];
}

export default class IssueViewConfiguration extends React.Component<IIssueViewConfigurationProps, IIssueViewConfigurationState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private queryBuilderComponents: { [itemKind: string]: (IssueQueryBuilder | TaskQueryBuilder) } = {};
  private savedConfigurationListDropdownComponent: Dropdown;
  private promptWindow: IWindow;

  constructor(props: IIssueViewConfigurationProps) {
    super();

    this.handleIssueQueryBuilderChange = this.handleIssueQueryBuilderChange.bind(this);
    this.handleTaskQueryBuilderChange = this.handleTaskQueryBuilderChange.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleSavePromptWindowConfirm = this.handleSavePromptWindowConfirm.bind(this);
    this.handleSavePromptWindowCloseRequest = this.handleSavePromptWindowCloseRequest.bind(this);
    this.handleConfigurationListDelete = this.handleConfigurationListDelete.bind(this);
    this.handleConfigurationListSelect = this.handleConfigurationListSelect.bind(this);
    this.handleOpenFilterCommandExecute = this.handleOpenFilterCommandExecute.bind(this);
    this.handleResetConfigurationCommandExecute = this.handleResetConfigurationCommandExecute.bind(this);
    this.handleSaveConfigurationCommandExecute = this.handleSaveConfigurationCommandExecute.bind(this);
    this.handleLoadConfigurationCommandExecute = this.handleLoadConfigurationCommandExecute.bind(this);

    this.state = {
      issueFilterQuery: props.configuration ? props.configuration.issueFilterQuery : undefined,
      taskFilterQuery: props.configuration ? props.configuration.taskFilterQuery : undefined,
      savedConfigurations: props.savedConfigurations,
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IIssueViewConfigurationProps) {
    this.state = {
      issueFilterQuery: props.configuration ? props.configuration.issueFilterQuery : undefined,
      taskFilterQuery: props.configuration ? props.configuration.taskFilterQuery : undefined,
      savedConfigurations: props.savedConfigurations,
    };
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    const configuration = Configuration.create({
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: this.state.taskFilterQuery
    });

    return [
      new IssueProjectFilterCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'project')),
      new IssueTypeFilterCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'type')),
      new TaskTypeFilterCommand(_.partial(this.handleOpenFilterCommandExecute, 'task', 'type')),
      new ResetConfigurationCommand(configuration, this.handleResetConfigurationCommandExecute),
      new SaveConfigurationCommand(configuration, this.handleSaveConfigurationCommandExecute),
      new LoadConfigurationCommand(this.handleLoadConfigurationCommandExecute),
    ];
  }

  private handleOpenFilterCommandExecute(itemKind: string, key: string) {
    this.queryBuilderComponents[itemKind].open(key);
  }

  private handleResetConfigurationCommandExecute() {
    this.props.onChange(Configuration.create());

    this.setState({
      issueFilterQuery: null,
      taskFilterQuery: null,
    });
  }

  private handleSaveConfigurationCommandExecute() {
    this.promptWindow = {
      content: <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={this.handleSavePromptWindowConfirm} onCloseRequest={this.handleSavePromptWindowCloseRequest} />,
      top: 120,
      width: 500,
      modal: true,
    };

    this.windowController.showWindow(this.promptWindow);
  }

  private handleLoadConfigurationCommandExecute() {
    this.savedConfigurationListDropdownComponent.open();
  }

  private async handleIssueQueryBuilderChange(query: NQL.Expression) {
    const configuration = Configuration.create({
      issueFilterQuery: query,
      taskFilterQuery: this.state.taskFilterQuery
    });

    this.props.onChange(configuration);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private async handleTaskQueryBuilderChange(query: NQL.Expression) {
    const configuration = Configuration.create({
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: query
    });

    this.props.onChange(configuration);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private handleResetButtonClick() {
    this.props.onChange(Configuration.create());

    this.setState({
      issueFilterQuery: null,
      taskFilterQuery: null,
    });
  }

  private handleSaveButtonClick() {
    this.promptWindow = {
      content: <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={this.handleSavePromptWindowConfirm} onCloseRequest={this.handleSavePromptWindowCloseRequest} />,
      top: 120,
      width: 500,
      modal: true,
    };

    this.windowController.showWindow(this.promptWindow);
  }

  private handleSavePromptWindowConfirm(name: string) {
    this.windowController.closeWindow(this.promptWindow);

    const configuration = Configuration.create({
      name,
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: this.state.taskFilterQuery
    });

    const savedConfigurations = this.state.savedConfigurations.concat(configuration);

    this.props.onSavedConfigurationsChange(savedConfigurations);

    this.setState({
      savedConfigurations,
    });
  }

  private handleSavePromptWindowCloseRequest() {
    this.windowController.closeWindow(this.promptWindow);
  }

  private handleConfigurationListDelete(configuration: IConfiguration) {
    const savedConfigurations = this.state.savedConfigurations.filter(x => x !== configuration);

    this.props.onSavedConfigurationsChange(savedConfigurations);

    this.setState({
      savedConfigurations,
    });
  }

  private handleConfigurationListSelect(configuration: IConfiguration) {
    this.savedConfigurationListDropdownComponent.close();
    this.props.onChange(configuration);
  }

  render() {
    return (
      <div className="issue-view-configuration-component">
        <div className="query-builders table">
          <div className="query-builder table-row">
            <div className="title table-cell">
              Filter Issues:
            </div>
            <div className="table-cell">
              <IssueQueryBuilder query={this.state.issueFilterQuery} onChange={this.handleIssueQueryBuilderChange} ref={e => this.queryBuilderComponents['issue'] = e} />
            </div>
          </div>
          <div className="separator"></div>
          <div className="query-builder table-row">
            <div className="title table-cell">
              Filter Tasks:
            </div>
            <div className="table-cell">
              <TaskQueryBuilder query={this.state.taskFilterQuery} onChange={this.handleTaskQueryBuilderChange} ref={e => this.queryBuilderComponents['task'] = e} />
            </div>
          </div>
        </div>
        <div className="buttons">
          {
            !this.props.configuration.isEmpty() &&
              <Button className="reset" type="secondary" onClick={this.handleResetButtonClick}>Reset</Button>
          }
          {
            !this.props.configuration.isEmpty() &&
              <Button className="save" type="secondary" onClick={this.handleSaveButtonClick}>Save</Button>
          }
          <Dropdown className="load" title="Load" ref={e => this.savedConfigurationListDropdownComponent = e}>
            <ConfigurationList configurations={this.state.savedConfigurations} onDelete={this.handleConfigurationListDelete} onSelect={this.handleConfigurationListSelect} />
          </Dropdown>
        </div>
      </div>
    );
  }
};

export * from './iconfiguration';
export * from './configuration';
