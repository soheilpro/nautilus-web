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
import ViewList from './view-list';
import { IView } from './iview';
import { View } from './view';
import FilterIssuesByMilestoneCommand from './filter-issues-by-milestone-command';
import FilterIssuesByProjectCommand from './filter-issues-by-project-command';
import FilterIssuesByTypeCommand from './filter-issues-by-type-command';
import FilterIssuesByPriorityCommand from './filter-issues-by-priority-command';
import FilterIssuesByStateCommand from './filter-issues-by-state-command';
import FilterIssuesByCreayedByCommand from './filter-issues-by-created-by-command';
import FilterTasksByTypeCommand from './filter-tasks-by-type-command';
import FilterTasksByStateCommand from './filter-tasks-by-state-command';
import FilterTasksByAssignedToCommand from './filter-tasks-by-assigned-to-command';
import FilterTasksByCreatedByCommand from './filter-tasks-by-created-by-command';
import ResetViewCommand from './reset-view-command';
import SaveViewCommand from './save-view-command';
import LoadViewCommand from './load-view-command';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssueViewViewProps {
  view?: IView;
  savedViews?: IView[];
  onChange(view: IView): void;
  onSavedViewsChange(savedViews: IView[]): void;
}

interface IIssueViewViewState {
  issueFilterQuery?: NQL.Expression;
  taskFilterQuery?: NQL.Expression;
  savedViews?: IView[];
}

export default class IssueViewView extends React.PureComponent<IIssueViewViewProps, IIssueViewViewState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private queryBuilderComponents: { [itemKind: string]: (IssueQueryBuilder | TaskQueryBuilder) } = {};
  private savedViewListDropdownComponent: Dropdown;
  private promptWindow: IWindow;

  constructor(props: IIssueViewViewProps) {
    super(props);

    this.handleIssueQueryBuilderChange = this.handleIssueQueryBuilderChange.bind(this);
    this.handleTaskQueryBuilderChange = this.handleTaskQueryBuilderChange.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleSavePromptWindowConfirm = this.handleSavePromptWindowConfirm.bind(this);
    this.handleSavePromptWindowCloseRequest = this.handleSavePromptWindowCloseRequest.bind(this);
    this.handleViewListDelete = this.handleViewListDelete.bind(this);
    this.handleViewListSelect = this.handleViewListSelect.bind(this);
    this.handleOpenFilterCommandExecute = this.handleOpenFilterCommandExecute.bind(this);
    this.handleResetViewCommandExecute = this.handleResetViewCommandExecute.bind(this);
    this.handleSaveViewCommandExecute = this.handleSaveViewCommandExecute.bind(this);
    this.handleLoadViewCommandExecute = this.handleLoadViewCommandExecute.bind(this);

    this.state = {
      issueFilterQuery: props.view ? props.view.issueFilterQuery : undefined,
      taskFilterQuery: props.view ? props.view.taskFilterQuery : undefined,
      savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IIssueViewViewProps) {
    this.setState({
      issueFilterQuery: props.view ? props.view.issueFilterQuery : undefined,
      taskFilterQuery: props.view ? props.view.taskFilterQuery : undefined,
      savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    const view = View.create({
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: this.state.taskFilterQuery
    });

    return [
      new FilterIssuesByMilestoneCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'milestone')),
      new FilterIssuesByProjectCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'project')),
      new FilterIssuesByTypeCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'type')),
      new FilterIssuesByPriorityCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'priority')),
      new FilterIssuesByStateCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'state')),
      new FilterIssuesByCreayedByCommand(_.partial(this.handleOpenFilterCommandExecute, 'issue', 'createdBy')),
      new FilterTasksByTypeCommand(_.partial(this.handleOpenFilterCommandExecute, 'task', 'type')),
      new FilterTasksByStateCommand(_.partial(this.handleOpenFilterCommandExecute, 'task', 'state')),
      new FilterTasksByAssignedToCommand(_.partial(this.handleOpenFilterCommandExecute, 'task', 'assignedTo')),
      new FilterTasksByCreatedByCommand(_.partial(this.handleOpenFilterCommandExecute, 'task', 'createdBy')),
      new ResetViewCommand(view, this.handleResetViewCommandExecute),
      new SaveViewCommand(view, this.handleSaveViewCommandExecute),
      new LoadViewCommand(this.handleLoadViewCommandExecute),
    ];
  }

  private handleOpenFilterCommandExecute(itemKind: string, key: string) {
    this.queryBuilderComponents[itemKind].open(key);
  }

  private handleResetViewCommandExecute() {
    this.props.onChange(View.create());

    this.setState({
      issueFilterQuery: null,
      taskFilterQuery: null,
    });
  }

  private handleSaveViewCommandExecute() {
    this.promptWindow = {
      content: <PromptWindow title="Save" placeholder="Name" confirmButtonText="Save" onConfirm={this.handleSavePromptWindowConfirm} onCloseRequest={this.handleSavePromptWindowCloseRequest} />,
      top: 120,
      width: 500,
      modal: true,
    };

    this.windowController.showWindow(this.promptWindow);
  }

  private handleLoadViewCommandExecute() {
    this.savedViewListDropdownComponent.open();
  }

  private async handleIssueQueryBuilderChange(query: NQL.Expression) {
    const view = View.create({
      issueFilterQuery: query,
      taskFilterQuery: this.state.taskFilterQuery
    });

    this.props.onChange(view);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private async handleTaskQueryBuilderChange(query: NQL.Expression) {
    const view = View.create({
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: query
    });

    this.props.onChange(view);

    this.setState({
      issueFilterQuery: query,
    });
  }

  private handleResetButtonClick() {
    this.props.onChange(View.create());

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

    const view = View.create({
      name,
      issueFilterQuery: this.state.issueFilterQuery,
      taskFilterQuery: this.state.taskFilterQuery
    });

    const savedViews = this.state.savedViews.concat(view);

    this.props.onSavedViewsChange(savedViews);

    this.setState({
      savedViews,
    });
  }

  private handleSavePromptWindowCloseRequest() {
    this.windowController.closeWindow(this.promptWindow);
  }

  private handleViewListDelete(view: IView) {
    const savedViews = this.state.savedViews.filter(x => x !== view);

    this.props.onSavedViewsChange(savedViews);

    this.setState({
      savedViews,
    });
  }

  private handleViewListSelect(view: IView) {
    this.savedViewListDropdownComponent.close();
    this.props.onChange(view);
  }

  render() {
    return (
      <div className="issue-view-settings-component">
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
            !this.props.view.isDefault() &&
              <Button className="reset" type="secondary" onClick={this.handleResetButtonClick}>Reset</Button>
          }
          {
            !this.props.view.isDefault() &&
              <Button className="save" type="secondary" onClick={this.handleSaveButtonClick}>Save</Button>
          }
          <Dropdown className="load" title="Load" ref={e => this.savedViewListDropdownComponent = e}>
            <ViewList views={this.state.savedViews} onDelete={this.handleViewListDelete} onSelect={this.handleViewListSelect} />
          </Dropdown>
        </div>
      </div>
    );
  }
};

export * from './iview';
export * from './view';
