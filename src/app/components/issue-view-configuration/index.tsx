import * as React from 'react';
import * as NQL from '../../nql';
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

export default class IssueViewConfiguration extends React.Component<IIssueViewConfigurationProps, IIssueViewConfigurationState> {
  private windowController = ServiceManager.Instance.getWindowController();
  private dropdownComponent: Dropdown;
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

    this.state = {
      issueFilterQuery: props.configuration ? props.configuration.issueFilterQuery : undefined,
      taskFilterQuery: props.configuration ? props.configuration.taskFilterQuery : undefined,
      savedConfigurations: props.savedConfigurations,
    };
  }

  componentWillReceiveProps(props: IIssueViewConfigurationProps) {
    this.state = {
      issueFilterQuery: props.configuration ? props.configuration.issueFilterQuery : undefined,
      taskFilterQuery: props.configuration ? props.configuration.taskFilterQuery : undefined,
      savedConfigurations: props.savedConfigurations,
    };
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
    this.dropdownComponent.close();
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
              <IssueQueryBuilder query={this.state.issueFilterQuery} onChange={this.handleIssueQueryBuilderChange} />
            </div>
          </div>
          <div className="separator"></div>
          <div className="query-builder table-row">
            <div className="title table-cell">
              Filter Tasks:
            </div>
            <div className="table-cell">
              <TaskQueryBuilder query={this.state.taskFilterQuery} onChange={this.handleTaskQueryBuilderChange} />
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
          <Dropdown className="load" title="Load" ref={e => this.dropdownComponent = e}>
            <ConfigurationList configurations={this.state.savedConfigurations} onDelete={this.handleConfigurationListDelete} onSelect={this.handleConfigurationListSelect} />
          </Dropdown>
        </div>
      </div>
    );
  }
};

export * from './iconfiguration';
export * from './configuration';
