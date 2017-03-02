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
  currentConfiguration?: IConfiguration;
  savedConfigurations?: IConfiguration[];
  onChange(configuration: IConfiguration): void;
  onSaveConfiguration(configuration: IConfiguration): void;
  onDeleteConfiguration(configuration: IConfiguration): void;
}

interface IIssueViewConfigurationState {
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
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
      issueFilterQuery: props.currentConfiguration.issueFilterQuery,
      taskFilterQuery: props.currentConfiguration.taskFilterQuery,
    };
  }

  componentWillReceiveProps(props: IIssueViewConfigurationProps) {
    this.state = {
      issueFilterQuery: props.currentConfiguration.issueFilterQuery,
      taskFilterQuery: props.currentConfiguration.taskFilterQuery,
    };
  }

  private async handleIssueQueryBuilderChange(query: NQL.Expression) {
    const configuration = Configuration.create(query, this.state.taskFilterQuery);

    this.props.onChange(configuration);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private async handleTaskQueryBuilderChange(query: NQL.Expression) {
    const configuration = Configuration.create(query, this.state.taskFilterQuery);

    this.props.onChange(configuration);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private handleResetButtonClick() {
    const configuration = Configuration.create(null, null);

    this.props.onChange(configuration);

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

  private handleSavePromptWindowConfirm(value: string) {
    this.windowController.closeWindow(this.promptWindow);

    const configuration = Configuration.create(this.state.issueFilterQuery, this.state.taskFilterQuery);
    configuration.name = value;

    this.props.onSaveConfiguration(configuration);
  }

  private handleSavePromptWindowCloseRequest() {
    this.windowController.closeWindow(this.promptWindow);
  }

  private handleConfigurationListDelete(configuration: IConfiguration) {
    this.props.onDeleteConfiguration(configuration);
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
              <IssueQueryBuilder query={this.props.currentConfiguration.issueFilterQuery} onChange={this.handleIssueQueryBuilderChange} />
            </div>
          </div>
          <div className="separator"></div>
          <div className="query-builder table-row">
            <div className="title table-cell">
              Filter Tasks:
            </div>
            <div className="table-cell">
              <TaskQueryBuilder query={this.props.currentConfiguration.taskFilterQuery} onChange={this.handleTaskQueryBuilderChange} />
            </div>
          </div>
        </div>
        <div className="buttons">
          {
            (this.props.currentConfiguration.issueFilterQuery || this.props.currentConfiguration.taskFilterQuery) &&
              <Button className="reset" type="secondary" onClick={this.handleResetButtonClick}>Reset</Button>
          }
          {
            (this.props.currentConfiguration.issueFilterQuery || this.props.currentConfiguration.taskFilterQuery) &&
              <Button className="save" type="secondary" onClick={this.handleSaveButtonClick}>Save</Button>
          }
          <Dropdown className="load" title="Load" ref={e => this.dropdownComponent = e}>
            <ConfigurationList configurations={this.props.savedConfigurations} onDelete={this.handleConfigurationListDelete} onSelect={this.handleConfigurationListSelect} />
          </Dropdown>
        </div>
      </div>
    );
  }
};

export * from './iconfiguration';
export * from './configuration';
