import React from 'react';
import { IProject, IItemPriority, IItemState, IItemType, IIssue, IIssueChange } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Input from '../input';
import ProjectSelect from '../project-select';
import ItemPrioritySelect from '../item-priority-select';
import ItemTypeSelect from '../item-type-select';
import ItemStateSelect from '../item-state-select';
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
  project?: IProject;
  type?: IItemType;
  priority?: IItemPriority;
  state?: IItemState;
  description?: string;
}

export default class AddEditIssueWindow extends React.Component<IAddEditIssueWindowProps, IAddEditIssueWindowState> {
  constructor(props: IAddEditIssueWindowProps) {
    super();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleProjectSelectChange = this.handleProjectSelectChange.bind(this);
    this.handleTypeInputChange = this.handleTypeInputChange.bind(this);
    this.handlePriorityInputChange = this.handlePriorityInputChange.bind(this);
    this.handleStateInputChange = this.handleStateInputChange.bind(this);
    this.handleDescriptionInputChange = this.handleDescriptionInputChange.bind(this);

    this.state = {};

    if (props.issue) {
      this.state.title = props.issue.title;
      this.state.project = props.issue.project;
      this.state.type = props.issue.type;
      this.state.priority = props.issue.priority;
      this.state.state = props.issue.state;
      this.state.description = props.issue.description;
    }
  }

  private handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    switch (this.props.mode) {
      case 'add':
        const issue: IIssue = {
          type: this.state.type,
          title: this.state.title,
          description: this.state.description,
          state: this.state.state,
          priority: this.state.priority,
          project: this.state.project,
        };

        this.props.onAdd(issue);
        break;

      case 'edit':
        const issueChange: IIssueChange = {
          type: this.state.type || null,
          title: this.state.title || null,
          description: this.state.description || null,
          state: this.state.state || null,
          priority: this.state.priority || null,
          project: this.state.project || null,
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

  private handleDescriptionInputChange(value: string) {
    this.setState({
      description: value,
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
                Description:
              </div>
              <div className="value">
                <Input className="description" value={this.state.description} multiline={true} selectOnFocus={true} onChange={this.handleDescriptionInputChange} />
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
