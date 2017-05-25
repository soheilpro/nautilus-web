import * as _ from 'underscore';
import * as React from 'react';
import { IMilestone, entityComparer } from '../../application';
import { IContextProvider } from '../../context';
import { ServiceManager } from '../../services';
import ArrayHelper from '../../utilities/array-helper';
import MilestoneViewSettings, { IView, View } from '../milestone-view-settings';
import MilestoneDetail from '../milestone-detail';
import MilestoneTable from '../milestone-table';
import MasterPage from '../master-page';
import CommandButton from '../command-button';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IMilestonesPageProps {
}

interface IMilestonesPageState {
  milestones?: IMilestone[];
  selectedMilestone?: IMilestone;
  view?: IView;
  savedViews?: IView[];
}

export default class MilestonesPage extends React.Component<IMilestonesPageProps, IMilestonesPageState> implements IContextProvider {
  private localStorage = ServiceManager.Instance.getLocalStorage();
  private roamingStorage = ServiceManager.Instance.getRoamingStorage();
  private application = ServiceManager.Instance.getApplication();
  private contextManager = ServiceManager.Instance.getContextManager();
  private milestoneDetailContainerElement: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationMilestoneAdd = this.handleApplicationMilestoneAdd.bind(this);
    this.handleApplicationMilestoneUpdate = this.handleApplicationMilestoneUpdate.bind(this);
    this.handleApplicationMilestoneDelete = this.handleApplicationMilestoneDelete.bind(this);
    this.handleMilestoneViewSettingsChange = this.handleMilestoneViewSettingsChange.bind(this);
    this.handleMilestoneViewSettingsSavedViewsChange = this.handleMilestoneViewSettingsSavedViewsChange.bind(this);
    this.handleMilestoneTableMilestoneSelect = this.handleMilestoneTableMilestoneSelect.bind(this);

    this.state = {
      milestones: [],
      view: View.create(),
      savedViews: [],
    };
  }

  componentWillMount() {
    this.contextManager.registerContextItemProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.items.on('milestone.add', this.handleApplicationMilestoneAdd);
    this.application.items.on('milestone.update', this.handleApplicationMilestoneUpdate);
    this.application.items.on('milestone.delete', this.handleApplicationMilestoneDelete);
  }

  async componentDidMount() {
    $(this.milestoneDetailContainerElement).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('milestones.view', View.create().toJSON()));
    const milestones = await this.application.items.getAllMilestones(view.filterExpression, view.sortExpressions);

    this.setState({
      milestones,
      selectedMilestone: _.last(milestones),
      view,
    });

    const savedViews = (await this.roamingStorage.get('milestones.views', [])).map(x => View.fromJSON(x));

    this.setState({
      savedViews: savedViews,
    });
  }

  componentWillUnmount() {
    this.application.items.off('milestone.delete', this.handleApplicationMilestoneDelete);
    this.application.items.off('milestone.update', this.handleApplicationMilestoneUpdate);
    this.application.items.off('milestone.add', this.handleApplicationMilestoneAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextItemProvider(this);
  }

  getContext() {
    return {
      'activeMilestone': this.state.selectedMilestone,
    };
  }

  private async handleApplicationLoad() {
    this.setState(async state => {
      const milestones = await this.application.items.getAllMilestones(state.view.filterExpression, state.view.sortExpressions);

      this.setState({
        milestones,
        selectedMilestone: _.last(milestones),
      });
    });
  }

  private async handleApplicationMilestoneAdd({ milestone }: { milestone: IMilestone }) {
    this.setState(state => {
      return {
        milestones: state.milestones.concat(milestone),
        selectedMilestone: milestone,
      };
    });
  }

  private async handleApplicationMilestoneUpdate({ milestone }: { milestone: IMilestone }) {
    this.setState(state => {
      return {
        milestones: ArrayHelper.replaceElement(state.milestones, milestone, milestone, entityComparer),
        selectedMilestone: milestone,
      };
    });
  }

  private async handleApplicationMilestoneDelete({ milestone }: { milestone: IMilestone }) {
    this.setState(state => {
      return {
        milestones: ArrayHelper.removeElement(state.milestones, milestone, entityComparer),
        selectedMilestone: undefined,
      };
    });
  }

  private async handleMilestoneViewSettingsChange(view: IView) {
    this.localStorage.set('milestones.view', view.toJSON());

    const milestones = await this.application.items.getAllMilestones(view.filterExpression, view.sortExpressions);

    this.setState({
      milestones,
      selectedMilestone: _.last(milestones),
      view,
    });
  }

  private async handleMilestoneViewSettingsSavedViewsChange(savedViews: IView[]) {
    this.roamingStorage.set('milestones.views', savedViews.map(view => view.toJSON()));

    this.setState({
      savedViews,
    });
  }

  private handleMilestoneTableMilestoneSelect(milestone: IMilestone) {
    this.setState({
      selectedMilestone: milestone,
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="milestones-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-milestone"><Icon name="plus" position="before" /> New Milestone</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <MilestoneViewSettings view={this.state.view} savedViews={this.state.savedViews} onChange={this.handleMilestoneViewSettingsChange} onSavedViewsChange={this.handleMilestoneViewSettingsSavedViewsChange} />
          </div>
          <div className="milestones row">
            <div className="milestone-list">
              <MilestoneTable milestones={this.state.milestones} selectedMilestone={this.state.selectedMilestone} onMilestoneSelect={this.handleMilestoneTableMilestoneSelect} />
            </div>
            <div className="divider"></div>
            <div className="milestone-detail">
              <div className="milestone-detail-container" ref={e => this.milestoneDetailContainerElement = e}>
              {
                this.state.selectedMilestone &&
                  <MilestoneDetail milestone={this.state.selectedMilestone} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
