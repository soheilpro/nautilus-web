import * as _ from 'underscore';
import * as React from 'react';
import * as NQL from '../../nql';
import { ICommandProvider } from '../../commands';
import { ServiceManager } from '../../services';
import { IWindow } from '../../windows';
import Button from '../button';
import Dropdown from '../dropdown';
import PromptWindow from '../prompt-window';
import MilestoneFilterQueryBuilder from '../milestone-filter-query-builder';
import Expression from '../expression';
import { IView } from './iview';
import { View } from './view';
import FilterByProjectCommand from './filter-by-project-command';
import FilterByStateCommand from './filter-by-state-command';
import FilterByCreatedByCommand from './filter-by-created-by-command';
import ResetViewCommand from './reset-view-command';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestoneViewViewProps {
  view?: IView;
  savedViews?: IView[];
  onChange(view: IView): void;
  onSavedViewsChange(savedViews: IView[]): void;
}

interface IMilestoneViewViewState {
  filterExpression?: NQL.IExpression;
  savedViews?: IView[];
}

export default class MilestoneViewView extends React.PureComponent<IMilestoneViewViewProps, IMilestoneViewViewState> implements ICommandProvider {
  private commandManager = ServiceManager.Instance.getCommandManager();
  private windowController = ServiceManager.Instance.getWindowController();
  private queryBuilderComponent: MilestoneFilterQueryBuilder;
  private savedViewListDropdownComponent: Dropdown;
  private promptWindow: IWindow;

  constructor(props: IMilestoneViewViewProps) {
    super(props);

    this.handleMilestoneFilterQueryBuilderChange = this.handleMilestoneFilterQueryBuilderChange.bind(this);
    this.handleResetButtonClick = this.handleResetButtonClick.bind(this);
    this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    this.handleSavePromptWindowConfirm = this.handleSavePromptWindowConfirm.bind(this);
    this.handleSavePromptWindowCloseRequest = this.handleSavePromptWindowCloseRequest.bind(this);
    this.handleViewListDelete = this.handleViewListDelete.bind(this);
    this.handleViewListSelect = this.handleViewListSelect.bind(this);
    this.handleOpenFilterCommandExecute = this.handleOpenFilterCommandExecute.bind(this);
    this.handleResetViewCommandExecute = this.handleResetViewCommandExecute.bind(this);

    this.state = {
      filterExpression: props.view ? props.view.filterExpression : undefined,
      savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
    };
  }

  componentWillMount() {
    this.commandManager.registerCommandProvider(this);
  }

  componentWillReceiveProps(props: IMilestoneViewViewProps) {
    this.setState({
      filterExpression: props.view ? props.view.filterExpression : undefined,
      savedViews: _.sortBy(props.savedViews, savedView => savedView.name),
    });
  }

  componentWillUnmount() {
    this.commandManager.unregisterCommandProvider(this);
  }

  getCommands() {
    const view = View.create({
      filterExpression: this.state.filterExpression,
    });

    return [
      new FilterByProjectCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'project')),
      new FilterByStateCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'state')),
      new FilterByCreatedByCommand(_.partial(this.handleOpenFilterCommandExecute, 'milestone', 'createdBy')),
      new ResetViewCommand(view, this.handleResetViewCommandExecute),
    ];
  }

  private handleOpenFilterCommandExecute(itemKind: string, key: string) {
    this.queryBuilderComponent.open(key);
  }

  private handleResetViewCommandExecute() {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: null,
    });
  }

  private handleMilestoneFilterQueryBuilderChange(query: NQL.IExpression) {
    const view = View.create({
      filterExpression: query,
    });

    this.props.onChange(view);

    this.setState({
      filterExpression: query,
    });
  }

  private handleResetButtonClick() {
    this.props.onChange(View.create());

    this.setState({
      filterExpression: null,
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
      filterExpression: this.state.filterExpression,
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
      <div className="milestone-view-settings-component">
        <div className="query">
          <div className="query-builder">
            <MilestoneFilterQueryBuilder query={this.state.filterExpression} onChange={this.handleMilestoneFilterQueryBuilderChange} ref={e => this.queryBuilderComponent = e} />
          </div>
          <div className="reset">
            {
              !this.props.view.isDefault() &&
                <Button className="reset-button" type="link" onClick={this.handleResetButtonClick}>Reset</Button>
            }
          </div>
        </div>
        <div className="query-text">
          {
            this.state.filterExpression ?
              <Expression expression={this.state.filterExpression} /> :
              <span className="no-filter">No filters selected.</span>
          }
        </div>
      </div>
    );
  }
};

export * from './iview';
export * from './view';
