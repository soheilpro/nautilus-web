import * as React from 'react';
import { IProject, IItemPriority, IItemState, IItemType, IIssue, IIssueChange, IItem, IUser } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Input from '../input';
import ProjectSelect from '../project-select';
import ItemPrioritySelect from '../item-priority-select';
import ItemTypeSelect from '../item-type-select';
import ItemStateSelect from '../item-state-select';
import MilestoneSelect from '../milestone-select';
import UserSelect from '../user-select';
import Button from '../button';

require('../../assets/stylesheets/base.less');
require('./index.less');

interface IAddEditIssueWindowProps {
  mode: 'add' | 'edit';
  issue?: IIssue;
  onAdd?(issue: IIssue): void;
  onUpdate?(issueChange: IIssueChange): void;
  onCloseRequest(): void;
}

interface IAddEditIssueWindowState {
  title?: string;
  description?: string;
  project?: IProject;
  type?: IItemType;
  priority?: IItemPriority;
  state?: IItemState;
  assignedTo?: IUser;
  milestone?: IItem;
}

export default class AddEditIssueWindow extends React.PureComponent<IAddEditIssueWindowProps, IAddEditIssueWindowState> {
  constructor(props: IAddEditIssueWindowProps) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);
    this.handleProjectSelectChange = this.handleProjectSelectChange.bind(this);
    this.handleTypeInputChange = this.handleTypeInputChange.bind(this);
    this.handlePriorityInputChange = this.handlePriorityInputChange.bind(this);
    this.handleStateInputChange = this.handleStateInputChange.bind(this);
    this.handleAssignedToInputChange = this.handleAssignedToInputChange.bind(this);
    this.handleMilestoneInputChange = this.handleMilestoneInputChange.bind(this);

    this.state = {};

    if (props.issue) {
      this.state.title = props.issue.title;
      this.state.description = props.issue.description;
      this.state.project = props.issue.project;
      this.state.type = props.issue.type;
      this.state.priority = props.issue.priority;
      this.state.state = props.issue.state;
      this.state.assignedTo = props.issue.assignedTo;
      this.state.milestone = props.issue.parent;
    }
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const issue: IIssue = {
          title: this.state.title,
          description: this.state.description,
          project: this.state.project,
          type: this.state.type,
          priority: this.state.priority,
          state: this.state.state,
          assignedTo: this.state.assignedTo,
          parent: this.state.milestone,
        };

        this.props.onAdd(issue);
        break;

      case 'edit':
        const issueChange: IIssueChange = {
          title: this.state.title,
          description: this.state.description,
          project: this.state.project || null,
          type: this.state.type || null,
          priority: this.state.priority || null,
          state: this.state.state || null,
          assignedTo: this.state.assignedTo || null,
          parent: this.state.milestone || null,
        };

        this.props.onUpdate(issueChange);
        break;
    }
  }

  private handleTitleInputChange(value: string) {
    this.setState({
      title: value,
    });
  }

  private handleDescriptionInputChange(value: string) {
    this.setState({
      description: value,
    });
  }

  private handleProjectSelectChange(value: IProject) {
    this.setState({
      project: value,
    });
  }

  private handleTypeInputChange(value: IItemType) {
    this.setState({
      type: value,
    });
  }

  private handlePriorityInputChange(value: IItemPriority) {
    this.setState({
      priority: value,
    });
  }

  private handleStateInputChange(value: IItemState) {
    this.setState({
      state: value,
    });
  }

  private handleAssignedToInputChange(value: IItemState) {
    this.setState({
      assignedTo: value,
    });
  }

  private handleMilestoneInputChange(value: IItem) {
    this.setState({
      milestone: value,
    });
  }

  render() {
    return (
      <Window className="add-edit-issue-window-component">
        <WindowHeader>
          { this.props.mode === 'add' && 'New Issue' }
          { this.props.mode === 'edit' && `Edit Issue #${this.props.issue.sid}` }
        </WindowHeader>
        <WindowContent>
          <form className="form" id="addEditIssueForm" onSubmit={this.handleFormSubmit}>
            <div className="field">
              <div className="label">
                Title:
              </div>
              <div className="value">
                <Input className="title" value={this.state.title} autoFocus={true} selectOnFocus={true} onChange={this.handleTitleInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Description:
              </div>
              <div className="value">
                <Input className="description" value={this.state.description} multiline={true} selectOnFocus={true} onChange={this.handleDescriptionInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Project:
              </div>
              <div className="value">
                <ProjectSelect className="project" project={this.state.project} onChange={this.handleProjectSelectChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Type:
              </div>
              <div className="value">
                <ItemTypeSelect className="type" itemKind="issue" itemType={this.state.type} onChange={this.handleTypeInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Priority:
              </div>
              <div className="value">
                <ItemPrioritySelect className="priority" itemKind="issue" itemPriority={this.state.priority} onChange={this.handlePriorityInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                State:
              </div>
              <div className="value">
                <ItemStateSelect className="state" itemKind="issue" itemState={this.state.state} onChange={this.handleStateInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Assigned To:
              </div>
              <div className="value">
                <UserSelect className="assigned-to-state" user={this.state.assignedTo} onChange={this.handleAssignedToInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Milestone:
              </div>
              <div className="value">
                <MilestoneSelect className="state" milestone={this.state.milestone} onChange={this.handleMilestoneInputChange} />
              </div>
            </div>
          </form>
        </WindowContent>
        <WindowActionBar>
          <Button type="secondary" onClick={this.props.onCloseRequest}>Cancel</Button>
          {
            this.props.mode === 'add' &&
              <Button type="submit" form="addEditIssueForm">Add Issue</Button>
          }
          {
            this.props.mode === 'edit' &&
              <Button type="submit" form="addEditIssueForm">Update Issue</Button>
          }
        </WindowActionBar>
      </Window>
    );
  }
};
