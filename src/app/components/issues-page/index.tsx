import * as _ from 'underscore';
import * as React from 'react';
import { IIssue, entityComparer } from '../../application';
import { IContextProvider } from '../../context';
import { ServiceManager } from '../../services';
import ArrayHelper from '../../utilities/array-helper';
import IssueViewSettings, { IView, View } from '../issue-view-settings';
import IssueDetail from '../issue-detail';
import ItemList from '../item-list';
import MasterPage from '../master-page';
import CommandButton from '../command-button';
import Icon from '../icon';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IIssuesPageProps {
}

interface IIssuesPageState {
  issues?: IIssue[];
  selectedIssue?: IIssue;
  view?: IView;
  savedViews?: IView[];
}

export default class IssuesPage extends React.Component<IIssuesPageProps, IIssuesPageState> implements IContextProvider {
  private localStorage = ServiceManager.Instance.getLocalStorage();
  private roamingStorage = ServiceManager.Instance.getRoamingStorage();
  private application = ServiceManager.Instance.getApplication();
  private contextManager = ServiceManager.Instance.getContextManager();
  private issueDetailContainerElement: HTMLElement;

  constructor() {
    super();

    this.handleApplicationLoad = this.handleApplicationLoad.bind(this);
    this.handleApplicationIssueAdd = this.handleApplicationIssueAdd.bind(this);
    this.handleApplicationIssueUpdate = this.handleApplicationIssueUpdate.bind(this);
    this.handleApplicationIssueDelete = this.handleApplicationIssueDelete.bind(this);
    this.handleIssueViewSettingsChange = this.handleIssueViewSettingsChange.bind(this);
    this.handleIssueViewSettingsSavedViewsChange = this.handleIssueViewSettingsSavedViewsChange.bind(this);
    this.handleItemListItemSelect = this.handleItemListItemSelect.bind(this);

    this.state = {
      issues: [],
      view: View.create(),
      savedViews: [],
    };
  }

  componentWillMount() {
    this.contextManager.registerContextItemProvider(this);
    this.application.on('load', this.handleApplicationLoad);
    this.application.items.on('issue.add', this.handleApplicationIssueAdd);
    this.application.items.on('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.on('issue.delete', this.handleApplicationIssueDelete);
  }

  async componentDidMount() {
    $(this.issueDetailContainerElement).sticky({
      topSpacing: 10,
    });

    const view = View.fromJSON(await this.localStorage.get('issues.view', View.create().toJSON()));
    const issues = await this.application.items.getAllIssues(view.filterQuery);

    this.setState({
      issues,
      selectedIssue: _.last(issues),
      view,
    });

    const savedViews = (await this.roamingStorage.get('issues.views', [])).map(x => View.fromJSON(x));

    this.setState({
      savedViews: savedViews,
    });
  }

  componentWillUnmount() {
    this.application.items.off('issue.delete', this.handleApplicationIssueDelete);
    this.application.items.off('issue.update', this.handleApplicationIssueUpdate);
    this.application.items.off('issue.add', this.handleApplicationIssueAdd);
    this.application.off('load', this.handleApplicationLoad);
    this.contextManager.unregisterContextItemProvider(this);
  }

  getContext() {
    return {
      'activeIssue': this.state.selectedIssue,
    };
  }

  private async handleApplicationLoad() {
    this.setState(async state => {
      const issues = await this.application.items.getAllIssues(state.view.filterQuery);

      this.setState({
        issues,
        selectedIssue: _.last(issues),
      });
    });
  }

  private async handleApplicationIssueAdd({ issue }: { issue: IIssue }) {
    this.setState({
      issues: this.state.issues.concat(issue),
      selectedIssue: issue,
    });
  }

  private async handleApplicationIssueUpdate({ issue }: { issue: IIssue }) {
    this.setState(state => {
      return {
        issues: ArrayHelper.replaceElement(state.issues, issue, issue, entityComparer),
        selectedIssue: issue,
      };
    });
  }

  private async handleApplicationIssueDelete({ issue }: { issue: IIssue }) {
    this.setState(state => {
      return {
        issues: ArrayHelper.removeElement(state.issues, issue, entityComparer),
        selectedIssue: undefined,
      };
    });
  }

  private async handleIssueViewSettingsChange(view: IView) {
    this.localStorage.set('issues.view', view.toJSON());

    const issues = await this.application.items.getAllIssues(view.filterQuery);

    this.setState({
      issues,
      selectedIssue: _.last(issues),
      view,
    });
  }

  private async handleIssueViewSettingsSavedViewsChange(savedViews: IView[]) {
    this.roamingStorage.set('issues.views', savedViews.map(view => view.toJSON()));

    this.setState({
      savedViews,
    });
  }

  private handleItemListItemSelect(issue: IIssue) {
    this.setState({
      selectedIssue: issue,
    });
  }

  render() {
    return (
      <MasterPage>
        <div className="issues-page-component">
          <div className="action-bar">
            <CommandButton commandId="new-issue"><Icon name="plus" position="before" /> New Issue</CommandButton>
            <CommandButton commandId="refresh" type="secondary"><Icon name="refresh" /></CommandButton>
          </div>
          <div className="view-settings row">
            <IssueViewSettings view={this.state.view} savedViews={this.state.savedViews} onChange={this.handleIssueViewSettingsChange} onSavedViewsChange={this.handleIssueViewSettingsSavedViewsChange} />
          </div>
          <div className="issues row">
            <div className="issue-list">
              <ItemList items={this.state.issues} selectedItem={this.state.selectedIssue} onItemSelect={this.handleItemListItemSelect} />
            </div>
            <div className="divider"></div>
            <div className="issue-detail">
              <div ref={e => this.issueDetailContainerElement = e}>
              {
                this.state.selectedIssue &&
                  <IssueDetail issue={this.state.selectedIssue} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
