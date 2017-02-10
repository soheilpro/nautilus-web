import * as React from 'react';
import { IProject, IIssuePriority, IIssueState, IIssueType, IIssue, IIssueChange } from '../../application';
import Window, { WindowHeader, WindowContent, WindowActionBar } from '../window';
import Input from '../input';
import ProjectDropdown from '../project-dropdown';
import IssuePriorityDropdown from '../issue-priority-dropdown';
import IssueTypeDropdown from '../issue-type-dropdown';
import IssueStateDropdown from '../issue-state-dropdown';
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
  type?: IIssueType;
  priority?: IIssuePriority;
  state?: IIssueState;
  description?: string;
}

export default class AddEditIssueWindow extends React.Component<IAddEditIssueWindowProps, IAddEditIssueWindowState> {
  constructor(props: IAddEditIssueWindowProps) {
    super();

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleTitleInputChange = this.handleTitleInputChange.bind(this);
    this.handleProjectDropdownChange = this.handleProjectDropdownChange.bind(this);
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
        let issue: IIssue = {
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
        let issueChange: IIssueChange = {
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

  private handleProjectDropdownChange(value: IProject) {
    this.setState({
      project: value,
    });
  }

  private handleTypeInputChange(value: IIssueType) {
    this.setState({
      type: value,
    });
  }

  private handlePriorityInputChange(value: IIssuePriority) {
    this.setState({
      priority: value,
    });
  }

  private handleStateInputChange(value: IIssueState) {
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
          {
            this.props.mode === 'add' ?
            'New Issue'
            : null
          }
          {
            this.props.mode === 'edit' ?
            `Edit Issue #${this.props.issue.sid}`
            : null
          }
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
                <ProjectDropdown className="project" project={this.state.project} onChange={this.handleProjectDropdownChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Type:
              </div>
              <div className="value">
                <IssueTypeDropdown className="issue-type" issueType={this.state.type} onChange={this.handleTypeInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                Priority:
              </div>
              <div className="value">
                <IssuePriorityDropdown className="issue-priority" issuePriority={this.state.priority} onChange={this.handlePriorityInputChange} />
              </div>
            </div>
            <div className="field">
              <div className="label">
                State:
              </div>
              <div className="value">
                <IssueStateDropdown className="issue-state" issueState={this.state.state} onChange={this.handleStateInputChange} />
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
            this.props.mode === 'add' ?
              <Button type="submit" form="addEditIssueForm">Add Issue</Button>
              : null
          }
          {
            this.props.mode === 'edit' ?
              <Button type="submit" form="addEditIssueForm">Update Issue</Button>
              : null
          }
        </WindowActionBar>
      </Window>
    );
  }
};
