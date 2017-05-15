import * as _ from 'underscore';
import * as React from 'react';
import { IItem, isIssue } from '../../application';
import { IContextProvider } from '../../context';
import { ServiceManager } from '../../services';
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
  items?: IItem[];
  selectedItem?: IItem;
  view?: IView;
  savedViews?: IView[];
}

export default class IssuesPage extends React.PureComponent<IIssuesPageProps, IIssuesPageState> implements IContextProvider {
  private roamingStorage = ServiceManager.Instance.getRoamingStorage();
  private application = ServiceManager.Instance.getApplication();
  private contextManager = ServiceManager.Instance.getContextManager();
  private itemDetailContainerElement: HTMLElement;

  constructor() {
    super();

    this.handleApplicationItemsAdd = this.handleApplicationItemsAdd.bind(this);
    this.handleApplicationItemsUpdate = this.handleApplicationItemsUpdate.bind(this);
    this.handleApplicationItemsDelete = this.handleApplicationItemsDelete.bind(this);
    this.handleIssueViewSettingsChange = this.handleIssueViewSettingsChange.bind(this);
    this.handleIssueViewSettingsSavedViewsChange = this.handleIssueViewSettingsSavedViewsChange.bind(this);
    this.handleItemListItemSelect = this.handleItemListItemSelect.bind(this);

    this.state = {
      items: [],
      view: View.create(),
      savedViews: [],
    };
  }

  componentWillMount() {
    this.contextManager.registerContextItemProvider(this);
    this.application.items.on('add', this.handleApplicationItemsAdd);
    this.application.items.on('update', this.handleApplicationItemsUpdate);
    this.application.items.on('delete', this.handleApplicationItemsDelete);
  }

  async componentDidMount() {
    $(this.itemDetailContainerElement).sticky({
      topSpacing: 10,
    });

    const items = await this.application.items.getAllIssues(null);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
    });

    const savedViews = (await this.roamingStorage.get('issues.views', [])).map(x => View.fromJSON(x));

    this.setState({
      savedViews: savedViews,
    });
  }

  componentWillUnmount() {
    this.application.items.off('delete', this.handleApplicationItemsDelete);
    this.application.items.off('update', this.handleApplicationItemsUpdate);
    this.application.items.off('add', this.handleApplicationItemsAdd);
    this.contextManager.unregisterContextItemProvider(this);
  }

  getContext() {
    return {
      'activeIssue': isIssue(this.state.selectedItem) ? this.state.selectedItem : undefined,
    };
  }

  private async handleApplicationItemsAdd({ item }: { item: IItem }) {
    this.setState({
      items: await this.application.items.getAllIssues(null),
      selectedItem: item,
    });
  }

  private async handleApplicationItemsUpdate({ item }: { item: IItem }) {
    this.setState({
      items: await this.application.items.getAllIssues(null),
      selectedItem: item,
    });
  }

  private async handleApplicationItemsDelete({ item }: { item: IItem }) {
    this.setState({
      items: await this.application.items.getAllIssues(null),
      selectedItem: undefined,
    });
  }

  private handleItemListItemSelect(item: IItem) {
    this.setState({
      selectedItem: item,
    });
  }

  private async handleIssueViewSettingsChange(view: IView) {
    const items = await this.application.items.getAllIssues(view.issueFilterQuery);

    this.setState({
      items,
      selectedItem: _.last(items.filter(isIssue)),
      view,
    });
  }

  private async handleIssueViewSettingsSavedViewsChange(savedViews: IView[]) {
    this.roamingStorage.set('issues.views', savedViews.map(view => view.toJSON()));

    this.setState({
      savedViews,
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
          <div className="items row">
            <div className="item-list">
              <ItemList items={this.state.items} selectedItem={this.state.selectedItem} onItemSelect={this.handleItemListItemSelect} />
            </div>
            <div className="divider"></div>
            <div className="item-detail">
              <div ref={e => this.itemDetailContainerElement = e}>
              {
                this.state.selectedItem &&
                  <IssueDetail issue={this.state.selectedItem} />
              }
              </div>
            </div>
          </div>
        </div>
      </MasterPage>
    );
  }
};
