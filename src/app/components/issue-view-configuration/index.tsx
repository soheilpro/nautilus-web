import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import Button from '../button';
import Dropdown from '../dropdown';
import PromptWindow from '../prompt-window';
import IssueQueryBuilder from '../issue-query-builder';
import TaskQueryBuilder from '../task-query-builder';
import SavedConfigurationList from './saved-configuration-list';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IConfiguration {
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
}

export interface ISavedConfiguration {
  id: string;
  name: string;
  configuration: IConfiguration;
}

interface IIssueViewConfigurationProps {
  currentConfiguration?: IConfiguration;
  savedConfigurations?: ISavedConfiguration[];
  onChange(configuration: IConfiguration): void;
  onSaveConfiguration(configuration: IConfiguration, name: string): void;
  onDeleteSavedConfiguration(savedConfiguration: ISavedConfiguration): void;
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
    this.handleSavedConfigurationListDelete = this.handleSavedConfigurationListDelete.bind(this);
    this.handleSavedConfigurationListSelect = this.handleSavedConfigurationListSelect.bind(this);

    this.state = {
      issueFilterQuery: props.currentConfiguration.issueFilterQuery,
      taskFilterQuery: props.currentConfiguration.taskFilterQuery,
    };
  }

  componentWillReceiveProps(nextProps: IIssueViewConfigurationProps) {
    this.state = {
      issueFilterQuery: nextProps.currentConfiguration.issueFilterQuery,
      taskFilterQuery: nextProps.currentConfiguration.taskFilterQuery,
    };
  }

  private async handleIssueQueryBuilderChange(query: NQL.Expression) {
    let configuration: IConfiguration = {
      issueFilterQuery: query,
      taskFilterQuery: this.state.taskFilterQuery,
    };

    this.props.onChange(configuration);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private async handleTaskQueryBuilderChange(query: NQL.Expression) {
    let configuration: IConfiguration = {
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: query,
    };

    this.props.onChange(configuration);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private handleResetButtonClick() {
    let configuration: IConfiguration = {
      issueFilterQuery: null,
      taskFilterQuery: null,
    };

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
    this.props.onSaveConfiguration(this.props.currentConfiguration, value);
  }

  private handleSavePromptWindowCloseRequest() {
    this.windowController.closeWindow(this.promptWindow);
  }

  private handleSavedConfigurationListDelete(savedConfiguration: ISavedConfiguration) {
    this.props.onDeleteSavedConfiguration(savedConfiguration);
  }

  private handleSavedConfigurationListSelect(savedConfiguration: ISavedConfiguration) {
    this.dropdownComponent.close();
    this.props.onChange(savedConfiguration.configuration);
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
            <SavedConfigurationList savedConfigurations={this.props.savedConfigurations} onDelete={this.handleSavedConfigurationListDelete} onSelect={this.handleSavedConfigurationListSelect} />
          </Dropdown>
        </div>
      </div>
    );
  }
};
